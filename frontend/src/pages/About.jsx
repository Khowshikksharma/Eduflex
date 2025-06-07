import React from 'react';
import Khowshikk from '../assets/khowshikk.jpg'
import Tarun from '../assets/tarun.jpeg'
const About = () => {
  const styles = {
    aboutPopupContent: {
      padding: '20px',
      maxWidth: '100%'
    },
    aboutHeading: {
      color: '#2c3e50',
      marginBottom: '20px',
      textAlign: 'center'
    },
    aboutIntro: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      marginBottom: '25px',
      textAlign: 'center'
    },
    aboutSection: {
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
    developersSection: {
      marginTop: '40px'
    },
    developersHeading: {
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: '30px'
    },
    developersContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      flexWrap: 'wrap'
    },
    developerCard: {
      width: '300px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'translateY(-5px)'
      }
    },
    developerImage: {
      width: '100%',
      height: '400px',
      objectFit: 'cover',
    },
    developerInfo: {
      padding: '20px'
    },
    developerName: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#2c3e50'
    },
    developerEducation: {
      fontSize: '0.9rem',
      marginBottom: '5px',
      color: '#7f8c8d'
    },
    developerSpecialization: {
      fontSize: '0.9rem',
      marginBottom: '5px',
      color: '#7f8c8d'
    },
    developerYear: {
      fontSize: '0.9rem',
      marginBottom: '15px',
      color: '#7f8c8d'
    },
    developerLink: {
      display: 'inline-block',
      padding: '8px 15px',
      backgroundColor: '#3498db',
      color: 'white',
      borderRadius: '5px',
      textDecoration: 'none',
      transition: 'background-color 0.3s ease',
      ':hover': {
        backgroundColor: '#2980b9'
      }
    }
  };

  return (
    <div style={styles.aboutPopupContent}>
      <h2 style={styles.aboutHeading}>About Eduflex</h2>
      <p style={styles.aboutIntro}>
        Eduflex is a leading online learning platform dedicated to providing high-quality education to students worldwide.
      </p>
      
      <div style={styles.aboutSection}>
        <h3 style={styles.sectionHeading}>Our Mission</h3>
        <p style={styles.sectionText}>
          To democratize education by making high-quality learning accessible, affordable, and flexible for everyone, everywhere.
        </p>
        <p style={styles.sectionText}>
          We envision a world where anyone can transform their life through access to the world's best education.
        </p>
      </div>
      
      <div style={styles.aboutSection}>
        <h3 style={styles.sectionHeading}>Key Features</h3>
        <ul style={styles.featuresList}>
          <li style={styles.listItem}>Expert instructors</li>
          <li style={styles.listItem}>Flexible learning schedules</li>
          <li style={styles.listItem}>Career advancement opportunities</li>
        </ul>
      </div>

      <div style={styles.developersSection}>
        <h3 style={styles.developersHeading}>Meet Our Developers</h3>
        <div style={styles.developersContainer}>
          {/* Developer 1 */}
          <div style={styles.developerCard}>
            <img 
              src={Khowshikk}
              alt="S. Khowshikk Sharma" 
              style={styles.developerImage}
            />
            <div style={styles.developerInfo}>
              <h4 style={styles.developerName}>S. Khowshikk Sharma</h4>
              <p style={styles.developerEducation}>B.TECH - Computer Science & Engineering</p>
              <p style={styles.developerSpecialization}>Specialization: Software Modelling & DevOps</p>
              <p style={styles.developerYear}>2022-2026</p>
              <a 
                href="https://www.linkedin.com/in/sripada-v-j-s-n-s-l-pkhowshikk-sharma-6a9337255/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.developerLink}
              >
                LinkedIn Profile
              </a>
            </div>
          </div>

          {/* Developer 2 */}
          <div style={styles.developerCard}>
            <img 
              src={Tarun}
              alt="S. Tarun Kumar" 
              style={styles.developerImage}
            />
            <div style={styles.developerInfo}>
              <h4 style={styles.developerName}>S. Tarun Kumar</h4>
              <p style={styles.developerEducation}>B.TECH - Computer Science & Engineering</p>
              <p style={styles.developerSpecialization}>Specialization: Software Modelling & DevOps</p>
              <p style={styles.developerYear}>2022-2026</p>
              <a 
                href="https://www.linkedin.com/in/samudrala-venkata-pavan-tarun-kumar-032242255/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.developerLink}
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;