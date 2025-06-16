import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import eduflexlogo from '../assets/edufelxlogo.jpg'

const Popup = ({ children, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    // const handleClickOutside = (event) => {
    //   if (popupRef.current && !popupRef.current.contains(event.target)) {
    //     onClose();
    //   }
    // };
  
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
  
    // Add event listeners
    // document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
  
    // Clean up event listeners on unmount
    return () => {
      // document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  

  return createPortal(
    <div style={styles.overlay}>
      <div style={styles.popupContainer} ref={popupRef}>
        {/* Logo Container - half inside, half outside */}
        <div style={styles.logoContainer}>
          <img 
            src={eduflexlogo} 
            alt="Eduflex Logo" 
            style={styles.logo}
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.style.cssText = `
                width: 120px;
                height: 40px;
                background: white;
                border: 2px solid red;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: red;
                font-weight: bold;
              `;
              fallback.textContent = 'EDUFLEX';
              e.target.parentNode.appendChild(fallback);
            }}
          />
        </div>
        
        <button style={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        {/* Top HR line placed right after the logo */}
        <hr style={styles.hrTop} />
        
        <div style={styles.content}>
          {children}
        </div>
        
      </div>
    </div>,
    document.getElementById('popup-root')
  );
};

// Styles remain the same as in your original code
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    width: '80%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    border: '1px solid black',
    marginTop: '20px',
  },
  logoContainer: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    height: '40px',
    zIndex: 1001,
  },
  logo: {
    height: '40px',
    width: 'auto',
    maxWidth: '120px',
    backgroundColor: '#fff',
    padding: '0 10px',
    objectFit: 'contain',
    borderRadius: '4px',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '0 10px',
    zIndex: 1001,
  },
  hrTop: {
    border: 'none',
    height: '1px',
    backgroundColor: '#000',
    margin: '29px 0 9px 0',
    width: '100%',
  },
  content: {
    margin: '10px 0',
  }
};

export default Popup;