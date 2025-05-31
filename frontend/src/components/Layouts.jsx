import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  FileAddFilled,
  MenuUnfoldOutlined,
  CreditCardOutlined,
  BookOutlined,
  NotificationOutlined,
  UserOutlined, // Add this import
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import eduflexlogo from '../assets/edufelxlogo.jpg';
import eduflexshortlogo from '../assets/eduflexshortlogo.png';

const { Header, Sider, Content, Footer } = Layout;

const Layouts = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Function to check screen size and update state
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
  };

  // Add event listener for window resize
  useEffect(() => {
    checkIsMobile(); // Check on initial render
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Inline styles for buttons
  const buttonStyle = {
    width: '120px', // Fixed width
    height: '40px', // Fixed height
    border: 'none',
    borderRadius: '4px',
    background: 'linear-gradient(45deg,rgb(73, 74, 75),rgb(111, 112, 113))', // Default gradient
    color: 'white',
    fontWeight: 'bold',
    transition: 'all 0.3s ease', // Smooth transition
  };

  const buttonHoverStyle = {
    background: 'linear-gradient(45deg,rgb(34, 35, 36),rgb(89, 90, 92))', // Gradient on hover
    transform: 'scale(1.05)', // Slight scale effect on hover
  };

  const buttonActiveStyle = {
    transform: 'scale(0.95)', // Slight scale effect on click
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md" // Collapse sidebar on medium screens
        collapsedWidth={isMobile ? 0 : 80} // Hide sidebar completely on mobile
        width={isMobile ? 0 : 200} // Adjust sidebar width for mobile
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1,
          transition: 'all 0.2s', // Smooth transition for sidebar
          background: '#fff', // White background for sidebar
        }}
      >
        <div className="demo-logo-vertical" style={{ textAlign: 'center', padding: '10px' }}>
          <img
            src={collapsed ? eduflexshortlogo : eduflexlogo}
            alt="Eduflex Logo"
            style={{
              width: collapsed ? '50px' : '180px',
              transition: 'all 0.1s',
            }}
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{
            background: '#fff',
            color: '#000',
          }}
          items={[
            {
              key: '1',
              icon: <FileAddFilled style={{ color: '#000' }} />,
              label: 'Course Registration',
            },
            {
              key: '2',
              icon: <BookOutlined style={{ color: '#000' }} />,
              label: 'Materials',
            },
            {
              key: '3',
              icon: <CreditCardOutlined style={{ color: '#000' }} />,
              label: 'Attendance',
            },
            {
              key: '4',
              icon: <NotificationOutlined style={{ color: '#000' }} />,
              label: 'Circulars',
            }
          ]}
        />

        {/* Profile Page Navigator */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            background: '#fff', // Match sidebar background
            borderTop: '1px solid #f0f0f0', // Add a border at the top
          }}
        >
          <Button
            type="primary"
            style={{
              width: '100%', // Full width
              height: '40px', // Fixed height
              background: 'linear-gradient(45deg,rgb(62, 63, 63),rgb(74, 74, 74))', // Gradient background
              color: 'white',
              fontWeight: 'bold',
              transition: 'all 0.3s ease', // Smooth transition
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(45deg,rgb(61, 62, 62),rgb(65, 66, 66))')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(45deg,rgb(62, 63, 63),rgb(74, 74, 74))')} // Match initial gradient
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {collapsed ? <UserOutlined style={{ color: '#FFFFFF' }} /> : 'Profile'}
          </Button>
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: isMobile || collapsed ? (isMobile ? 0 : 80) : 200 }}>
        {/* Fixed Header */}
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            position: 'fixed',
            top: 0,
            zIndex: 2, // Ensure header is above sidebar
            width: `calc(100% - ${isMobile || collapsed ? (isMobile ? 0 : 80) : 200}px)`, // Adjust width based on sidebar state
            left: isMobile || collapsed ? (isMobile ? 0 : 80) : 200, // Align with sidebar
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s', // Smooth transition for header
          }}
        >
          {/* Toggle Button */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 54,
              height: 54,
            }}
          />

          {/* Additional Header Content (Buttons) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center', // Vertically center the buttons
              gap: '15px', // Equal spacing between buttons
              height: 54, // Set height of header
              width: '100%', // Take up remaining space
              justifyContent: 'flex-end', // Right align buttons
            }}
          >
            <span style={{ marginRight: 15 }}>Welcome, User!</span>
            <Button
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
              onMouseLeave={(e) => (e.currentTarget.style.background = buttonStyle.background)}
              onMouseDown={(e) => (e.currentTarget.style.transform = buttonActiveStyle.transform)}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Home
            </Button>
            <Button
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
              onMouseLeave={(e) => (e.currentTarget.style.background = buttonStyle.background)}
              onMouseDown={(e) => (e.currentTarget.style.transform = buttonActiveStyle.transform)}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              My Courses
            </Button>
            <Button
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
              onMouseLeave={(e) => (e.currentTarget.style.background = buttonStyle.background)}
              onMouseDown={(e) => (e.currentTarget.style.transform = buttonActiveStyle.transform)}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Time Table
            </Button>
            <Button
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
              onMouseLeave={(e) => (e.currentTarget.style.background = buttonStyle.background)}
              onMouseDown={(e) => (e.currentTarget.style.transform = buttonActiveStyle.transform)}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Logout
            </Button>
          </div>
        </Header>

        {/* Scrollable Content */}
        <Content
          style={{
            marginTop: 64, // Offset for fixed header
            marginBottom: 114, // Offset for fixed footers (64px + 64px)
            padding: 24,
            minHeight: 'calc(100vh - 192px)', // Adjust height for header and footers
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto', // Enable scrolling
          }}
          
        >
          My Home Student Dashborad
          {children}
          
        </Content>


        {/* First Footer Block */}
        <Footer
          style={{
            textAlign: 'center',
            background: '#636262', // Dark gray background
            position: 'fixed',
            bottom: 45, // Position above the second footer
            zIndex: 1, // Ensure footer is above sidebar
            width: `calc(100% - ${isMobile || collapsed ? (isMobile ? 0 : 80) : 200}px)`, // Adjust width based on sidebar state
            left: isMobile || collapsed ? (isMobile ? 0 : 80) : 200, // Align with sidebar
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s', // Smooth transition for footer
            padding: '16px 24px', // Add padding for better spacing
          }}
        >
          {/* Navigators */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center', // Center the navigators horizontally
              gap: '100px', // Space between navigators
              flexWrap: 'wrap', // Wrap navigators on smaller screens
            }}
          >
            <a href="/help" style={{ color: '#fff', textDecoration: 'none' }}>Help</a>
            <a href="/about" style={{ color: '#fff', textDecoration: 'none' }}>About</a>
            <a href="/privacy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy</a>
            <a href="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a>
          </div>
        </Footer>

        {/* Second Footer Block */}
        <Footer
          style={{
            textAlign: 'center',
            background: '#C9C4C4', // Light gray background
            position: 'fixed',
            bottom: 0, // Position at the bottom
            zIndex: 2, // Ensure footer is above sidebar
            width: `calc(100% - ${isMobile || collapsed ? (isMobile ? 0 : 80) : 200}px)`, // Adjust width based on sidebar state
            left: isMobile || collapsed ? (isMobile ? 0 : 80) : 200, // Align with sidebar
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s', // Smooth transition for footer
            padding: '10px 24px', // Add padding for better spacing
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'center', // Center align text
              color: '#000',
            }}
          >
            Copyright © 2024 SET EDUCATION TECHNOLOGY PRIVATE LIMITED. All rights reserved.
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Layouts;