import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', { username, password });

      if (response.data.success) {
        navigate('/');
      } else {
        // Handle specific errors based on server response
        if (response.data.error === 'User already exists') {
          alert('User already exists. Please choose a different username.');
        } else {
          alert('Sign up failed: ' + response.data.error);
        }
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      alert('An error occurred during sign up.');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          <p>Already have an account? <a href="/">Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
