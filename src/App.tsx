import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import useAuthStore from './store/useAuthStore';

function App() {
  const { user } = useAuthStore();

  return (
    <>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/chats" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/chats" />} 
          />
          <Route 
            path="/chats" 
            element={user ? <Chat /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/chats" : "/register"} />} 
          />
        </Routes>
      </Router>
      <Toaster position="top-center" />
    </>
  );
}

export default App;