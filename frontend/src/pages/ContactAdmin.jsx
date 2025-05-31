import React from 'react';

const ContactAdmin = () => {
  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const headingStyle = {
    fontSize: '2rem',
    color: '#2563eb',
    marginBottom: '30px',
    textAlign: 'center'
  };

  const textStyle = {
    fontSize: '1.1rem',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#1e293b'
  };

  const listStyle = {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#f8fafc',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const itemStyle = {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center'
  };

  const iconStyle = {
    marginRight: '15px',
    color: '#2563eb',
    fontSize: '1.2rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Contact Administrator</h1>
      <p style={textStyle}>Please use the following information to contact the administrator:</p>
      
      <ul style={listStyle}>
        <li style={itemStyle}>
          <i className="fa fa-envelope" style={iconStyle}></i>
          <span>Email: admin@eduflex.com</span>
        </li>
        <li style={itemStyle}>
          <i className="fa fa-phone" style={iconStyle}></i>
          <span>Phone: +91 6309876645</span>
        </li>
        <li style={{...itemStyle, borderBottom: 'none'}}>
          <i className="fa fa-map-marker-alt" style={iconStyle}></i>
          <span>Office: Eduflex Headquarters, Hyderabad, India</span>
        </li>
      </ul>
    </div>
  );
};

export default ContactAdmin;