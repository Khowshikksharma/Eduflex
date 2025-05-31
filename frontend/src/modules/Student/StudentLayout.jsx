import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardFilled,
  SignalFilled,
  FileAddFilled,
  LayoutFilled,
  ProjectFilled,
  BookOutlined,
  CreditCardOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import eduflexlogo from '../../assets/edufelxlogo.jpg';
import eduflexshortlogo from '../../assets/eduflexshortlogo.png';
import usePopup from '../../components/usePopup';
import Help from '../../pages/Help';
import Privacy from '../../pages/Privacy';
import About from '../../pages/About';
import Contact from '../../pages/Contact';

const { Header, Sider, Content, Footer } = Layout;

const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showPopup, PopupWrapper } = usePopup();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const getSidebarItems = () => {
    if (location.pathname.includes('/student/home')) {
      return [
        {
          key: 'dashboard',
          icon: <DashboardFilled style={{ color: '#000' }} />,
          label: 'Dashboard',
          onClick: () => navigate('/student/home/dashboard'),
        }
      ];
    } else if (location.pathname.includes('/student/mycourse')) {
      return [
        {
          key: 'grades',
          icon: <SignalFilled style={{ color: '#000' }} />,
          label: 'Grades',
          onClick: () => navigate('/student/mycourse/grades'),
        },
        {
          key: 'course-registration',
          icon: <FileAddFilled style={{ color: '#000' }} />,
          label: 'Course Registration',
          onClick: () => navigate('/student/mycourse/course-registration'),
        },
        {
          key: 'materials',
          icon: <BookOutlined style={{ color: '#000' }} />,
          label: 'Materials',
          onClick: () => navigate('/student/mycourse/materials'),
        },
        {
          key: 'attendance',
          icon: <CreditCardOutlined style={{ color: '#000' }} />,
          label: 'Attendance',
          onClick: () => navigate('/student/mycourse/attendance'),
        },
        {
          key: 'circulars',
          icon: <NotificationOutlined style={{ color: '#000' }} />,
          label: 'Circulars',
          onClick: () => navigate('/student/mycourse/circular'),
        },
      ];
    } else if (location.pathname.includes('/student/timetable')) {
      return [
        {
          key: 'class',
          icon: <ProjectFilled style={{ color: '#000' }} />,
          label: 'Class',
          onClick: () => navigate('/student/timetable/class'),
        },
        {
          key: 'academic',
          icon: <LayoutFilled style={{ color: '#000' }} />,
          label: 'Academic',
          onClick: () => navigate('/student/timetable/academic'),
        }
      ];
    }
    return [];
  };

  const getDefaultSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return ['dashboard'];
    if (path.includes('grades')) return ['grades'];
    if (path.includes('course-registration')) return ['course-registration'];
    if (path.includes('materials')) return ['materials'];
    if (path.includes('attendance')) return ['attendance'];
    if (path.includes('circular')) return ['circular'];
    if (path.includes('class')) return ['class'];
    if (path.includes('academic')) return ['academic'];
    return ['dashboard'];
  };

  const buttonStyle = {
    width: '120px',
    height: '40px',
    border: 'none',
    borderRadius: '4px',
    background: 'linear-gradient(45deg,rgb(73, 74, 75),rgb(111, 112, 113))',
    color: 'white',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  };

  const buttonHoverStyle = {
    background: 'linear-gradient(45deg,rgb(34, 35, 36),rgb(89, 90, 92))',
    transform: 'scale(1.05)',
  };

  const buttonActiveStyle = {
    transform: 'scale(0.95)',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        width={isMobile ? 0 : 200}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 2,
          transition: 'all 0.2s',
          background: '#fff',
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
          defaultSelectedKeys={getDefaultSelectedKey()}
          selectedKeys={getDefaultSelectedKey()}
          style={{
            background: '#fff',
            color: '#000',
          }}
          items={getSidebarItems().map(item => ({
            ...item,
            onClick: item.onClick,
          }))}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              setCollapsed(true);
              navigate('/student/editprofile');
            }}
            style={{
              width: '100%',
              height: '40px',
              background: 'linear-gradient(45deg,rgb(62, 63, 63),rgb(74, 74, 74))',
              color: 'white',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(45deg,rgb(61, 62, 62),rgb(65, 66, 66))')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(45deg,rgb(62, 63, 63),rgb(74, 74, 74))')}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {collapsed ? <UserOutlined style={{ color: '#FFFFFF' }} /> : 'Edit Profile'}
          </Button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: isMobile || collapsed ? (isMobile ? 0 : 80) : 200 }}>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            position: 'fixed',
            top: 0,
            zIndex: 1,
            width: `calc(100% - ${isMobile || collapsed ? (isMobile ? 0 : 80) : 200}px)`,
            left: isMobile || collapsed ? (isMobile ? 0 : 80) : 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s',
          }}
        >
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

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              height: 54,
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <span style={{ marginRight: 15 }}>Welcome, User!</span>
            <Button
              style={buttonStyle}
              onClick={() => navigate('/student/home/dashboard')}
              onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
              onMouseLeave={(e) => (e.currentTarget.style.background = buttonStyle.background)}
              onMouseDown={(e) => (e.currentTarget.style.transform = buttonActiveStyle.transform)}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Home
            </Button>
            <Button
              style={buttonStyle}
              onClick={() => navigate('/student/mycourse/grades')}
              onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
              onMouseLeave={(e) => (e.currentTarget.style.background = buttonStyle.background)}
              onMouseDown={(e) => (e.currentTarget.style.transform = buttonActiveStyle.transform)}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              My Courses
            </Button>
            <Button
              style={buttonStyle}
              onClick={() => navigate('/student/timetable/class')}
              onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
              onMouseLeave={(e) => (e.currentTarget.style.background = buttonStyle.background)}
              onMouseDown={(e) => (e.currentTarget.style.transform = buttonActiveStyle.transform)}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Time Table
            </Button>
            <Button
              style={buttonStyle}
              onClick={() => navigate('/')}
              onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
              onMouseLeave={(e) => (e.currentTarget.style.background = buttonStyle.background)}
              onMouseDown={(e) => (e.currentTarget.style.transform = buttonActiveStyle.transform)}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Logout
            </Button>
          </div>
        </Header>

        <Content
          style={{
            marginTop: 64,
            marginBottom: 114,
            padding: 24,
            minHeight: 'calc(100vh - 192px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: 'center',
            background: '#636262',
            position: 'fixed',
            bottom: 45,
            zIndex: 1,
            width: `calc(100% - ${isMobile || collapsed ? (isMobile ? 0 : 80) : 200}px)`,
            left: isMobile || collapsed ? (isMobile ? 0 : 80) : 200,
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s',
            padding: '16px 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '100px',
              flexWrap: 'wrap',
            }}
          >
            <button 
              onClick={() => showPopup(<Help />)} 
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              Help
            </button>
            <button 
              onClick={() => showPopup(<About />)} 
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              About
            </button>
            <button 
              onClick={() => showPopup(<Privacy />)} 
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              Privacy
            </button>
            <button 
              onClick={() => showPopup(<Contact />)} 
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              Contact
            </button>
          </div>
        </Footer>

        <Footer
          style={{
            textAlign: 'center',
            background: '#C9C4C4',
            position: 'fixed',
            bottom: 0,
            zIndex: 2,
            width: `calc(100% - ${isMobile || collapsed ? (isMobile ? 0 : 80) : 200}px)`,
            left: isMobile || collapsed ? (isMobile ? 0 : 80) : 200,
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s',
            padding: '10px 24px',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#000',
            }}
          >
            Copyright © 2024 SET EDUCATION TECHNOLOGY PRIVATE LIMITED. All rights reserved.
          </div>
        </Footer>

        <PopupWrapper />
      </Layout>
    </Layout>
  );
};

export default StudentLayout;