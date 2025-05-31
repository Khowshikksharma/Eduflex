import React from 'react';

const Help = () => {
  const styles = {
    helpPopupContent: {
      padding: '20px',
      maxWidth: '100%'
    },
    helpHeading: {
      color: '#2c3e50',
      marginBottom: '20px',
      textAlign: 'center'
    },
    helpIntro: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      marginBottom: '25px',
      textAlign: 'center'
    },
    helpSection: {
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
    featuresList: {
      listStyleType: 'disc',
      paddingLeft: '20px'
    },
    listItem: {
      marginBottom: '8px'
    },
    contactInfo: {
      marginTop: '30px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px'
    }
  };

  return (
    <div style={styles.helpPopupContent}>
      <h2 style={styles.helpHeading}>Help Center</h2>
      <p style={styles.helpIntro}>
        Find answers to common questions and get support for your Eduflex experience.
      </p>
      
      <div style={styles.helpSection}>
        <h3 style={styles.sectionHeading}>Getting Started</h3>
        <ul style={styles.featuresList}>
          <li style={styles.listItem}>Enrolling in courses</li>
          <li style={styles.listItem}>Navigating the platform</li>
        </ul>
      </div>
      
      <div style={styles.helpSection}>
        <h3 style={styles.sectionHeading}>Troubleshooting</h3>
        <ul style={styles.featuresList}>
          <li style={styles.listItem}>Login issues</li>
          <li style={styles.listItem}>Course access problems</li>
        </ul>
      </div>

      <div style={styles.helpSection}>
        <h3 style={styles.sectionHeading}>FAQs</h3>
        <ul style={styles.featuresList}>
          <li style={styles.listItem}>How do I reset my password?</li>
          <li style={styles.listItem}>Can I download course materials?</li>
        </ul>
      </div>

      <div style={styles.contactInfo}>
        <h3 style={styles.sectionHeading}>Still need help?</h3>
        <p style={styles.sectionText}>
          Contact our support team at <strong>support@eduflex.com</strong> or call us at <strong>(+91) 63098-76645</strong>.
        </p>
      </div>
    </div>
  );
};

export default Help;