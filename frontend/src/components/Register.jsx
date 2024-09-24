import React, { useState } from 'react';
import { register } from '../authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password1, password2);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please check your details.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;