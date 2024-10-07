import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import TopicPage from './pages/TopicPage';
import UserProfile from './pages/UserProfile';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topic/:id" element={<TopicPage />} />
            <Route path="/profile/:username" element={<UserProfile />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover draggable />
    </AuthProvider>
  );
}

export default App;
