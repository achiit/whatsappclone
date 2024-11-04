import express from 'express';
import Chat from '../models/Chat.js';
import User from '../models/User.js';

const router = express.Router();

// Get all chats for the current user
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
    .populate('participants', 'name email avatar status')
    .populate('lastMessage')
    .sort('-updatedAt');

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a specific chat
router.get('/:chatId/messages', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate({
        path: 'messages.sender',
        select: 'name avatar'
      });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message in a chat
router.post('/:chatId/messages', async (req, res) => {
  try {
    const { text } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = {
      sender: req.user._id,
      text,
      createdAt: new Date()
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    await chat.save();

    const populatedMessage = await Chat.populate(message, {
      path: 'sender',
      select: 'name avatar'
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new chat
router.post('/', async (req, res) => {
  try {
    const { participantId } = req.body;

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] }
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    const chat = new Chat({
      participants: [req.user._id, participantId]
    });

    await chat.save();
    
    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name email avatar status');

    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;