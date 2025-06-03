import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import loginImage from '../assets/loginrocket.jpg';
import axios from 'axios';
import config from '../config';

const LoginPopup = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const admin = await axios.post(`${config.url}/admin/checkadminlogin`, { email, password });
    try{
      if(admin.data != null){
        localStorage.setItem('admin', JSON.stringify(admin.data));
        navigate('/admin/home/dashboard');
      }
    }catch (e) {
      setError('Invalid email or password'+ e.message);
    }
    setLoading(true);
    setError(e.target.value);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
  };
  // Styles
  const containerStyle = {
    display: 'flex',
    maxWidth: '800px',
    width: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff'
  };

  const formContainerStyle = {
    padding: '40px',
    width: '50%',
    minWidth: '400px',
    background: 'linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 40%,rgb(136, 129, 129) 100%)',
    color: '#1e293b'
  };

  const imageContainerStyle = {
    width: '50%',
    backgroundImage: `url(${loginImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '400px'
  };

  const headingStyle = {
    color: '#2563eb',
    marginBottom: '25px',
    textAlign: 'center',
    fontSize: '1.8rem'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#1e293b'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease'
  };

  const footerStyle = {
    marginTop: '25px',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#64748b'
  };

  const linkStyle = {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500'
  };

  const errorStyle = {
    color: '#ef4444',
    marginBottom: '15px',
    textAlign: 'center',
    fontSize: '0.9rem'
  };


  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={headingStyle}>Login to Eduflex</h2>
        {error && <div style={errorStyle}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={inputStyle}
              disabled={loading}
            />
          </div>
          
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={inputStyle}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={footerStyle}>
          <p>
            Having trouble logging in?{' '}
            <Link to="/forgot-password" onClick={onClose} style={linkStyle}>
              Forgot Password
            </Link>{' '}
            or{' '}
            <Link to="/contact-admin" onClick={onClose} style={linkStyle}>
              Contact Administrator
            </Link>
          </p>
        </div>
      </div>

      <div style={imageContainerStyle}></div>
    </div>
  );
};

export default LoginPopup;