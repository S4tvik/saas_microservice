import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user-login', {
        username,
        password,
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      console.log(token);
      onLogin({ username, role });
      navigate('/'); // Use navigate to redirect to the home page after successful login
    } catch (error) {
      setError('Invalid username or password');
      console.log(error);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center " style={{ height: '100vh' }}>
      <div className="card p-4 bg-dark text-light">
        <h2 className="mb-4">Login</h2>
        <div className="text-danger mb-3">{error}</div>
        <form>
          <div className="form-group">
            <label>Username:</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group mb-5">
            <label>Password:</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="button" className="btn btn-primary mb-5" onClick={handleLogin}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;