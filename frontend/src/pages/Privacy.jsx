import React from 'react';

const Privacy = () => {
  const styles = {
    privacyPopupContent: {
      padding: '20px',
      maxWidth: '100%'
    },
    privacyHeading: {
      color: '#2c3e50',
      marginBottom: '20px',
      textAlign: 'center'
    },
    privacyIntro: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      marginBottom: '25px',
      textAlign: 'center'
    },
    privacySection: {
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
    }
  };

  return (
    <div style={styles.privacyPopupContent}>
      <h2 style={styles.privacyHeading}>Privacy Policy</h2>
      <p style={styles.privacyIntro}>
        At Eduflex, we are committed to protecting your privacy and ensuring the security of your personal information.
      </p>
      
      <div style={styles.privacySection}>
        <h3 style={styles.sectionHeading}>Information We Collect</h3>
        <p style={styles.sectionText}>
          We collect information you provide when you create an account, enroll in courses, or contact us for support.
        </p>
        <ul style={styles.featuresList}>
          <li style={styles.listItem}>Personal identification information (Name, email, etc.)</li>
          <li style={styles.listItem}>Payment information for course purchases</li>
          <li style={styles.listItem}>Learning progress and course interactions</li>
        </ul>
      </div>
      
      <div style={styles.privacySection}>
        <h3 style={styles.sectionHeading}>How We Use Your Information</h3>
        <p style={styles.sectionText}>
          Your information helps us provide and improve our services, process payments, and communicate with you.
        </p>
      </div>

      <div style={styles.privacySection}>
        <h3 style={styles.sectionHeading}>Data Security</h3>
        <p style={styles.sectionText}>
          We implement industry-standard security measures to protect your data from unauthorized access or disclosure.
        </p>
      </div>
    </div>
  );
};

export default Privacy;