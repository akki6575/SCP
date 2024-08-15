// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import DetectionPage from './components/DetectionPage/DetectionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1 className='heading'>Package Damage DetectionPage</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/package-damage-detection" element={<DetectionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
