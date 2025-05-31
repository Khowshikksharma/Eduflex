import React from 'react';

const Contact = () => {
  const styles = {
    contactPopupContent: {
      padding: '20px',
      maxWidth: '100%'
    },
    contactHeading: {
      color: '#2c3e50',
      marginBottom: '20px',
      textAlign: 'center'
    },
    contactIntro: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      marginBottom: '25px',
      textAlign: 'center'
    },
    contactSection: {
      marginBottom: '20px'
    },
    sectionHeading: {
      color: '#3498db',
      marginBottom: '10px'
    },
    sectionText: {
      lineHeight: '1.6',
      marginBottom: '10px'
    },
    contactInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginTop: '30px'
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    icon: {
      fontSize: '1.5rem',
      color: '#3498db'
    }
  };

  return (
    <div style={styles.contactPopupContent}>
      <h2 style={styles.contactHeading}>Contact Us</h2>
      <p style={styles.contactIntro}>
        We'd love to hear from you! Reach out to our team for any questions or feedback.
      </p>
      
      <div style={styles.contactSection}>
        <h3 style={styles.sectionHeading}>General Inquiries</h3>
        <p style={styles.sectionText}>
          For general questions about our platform, courses, or services.
        </p>
      </div>
      
      <div style={styles.contactSection}>
        <h3 style={styles.sectionHeading}>Technical Support</h3>
        <p style={styles.sectionText}>
          Need help with your account or experiencing technical issues?
        </p>
      </div>

      <div style={styles.contactInfo}>
        <div style={styles.contactItem}>
          <span style={styles.icon}>📧</span>
          <span>Email: contact@eduflex.com</span>
        </div>
        <div style={styles.contactItem}>
          <span style={styles.icon}>📞</span>
          <span>Phone: (123) 456-7890</span>
        </div>
        <div style={styles.contactItem}>
          <span style={styles.icon}>🏢</span>
          <span>Address: 123 Education St, Learning City, 10101</span>
        </div>
        <div style={styles.contactItem}>
          <span style={styles.icon}>🕒</span>
          <span>Hours: Monday-Friday, 9AM-5PM (EST)</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;