import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./landingstyle.css";
import EduflexLogo from '../assets/edufelxlogo.jpg';
import usePopup from '../components/usePopup';
import About from './About';
import LoginPopup from './LoginPopup';
import { Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import config from "../config";
import axios from "axios";
import toast from "react-hot-toast";

const AllCourses = ({setAuthState}) => {
  const [click, setClick] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { showPopup, PopupWrapper } = usePopup();
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    axios.get(`${config.url}/viewCourses`)
      .then((response) => {
        const coursesData = response.data;
        if (Array.isArray(coursesData)) {
          const mappedCourses = coursesData.map((c,index) => ({
            sNo: index + 1,
            ccode: c.ccode,
            cname: c.cname,
            credits: c.credits,
          }));
          setAllCourses(mappedCourses);
        } else {
          setAllCourses([]);
          console.warn('API response is not an array:', coursesData);
        }
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        toast.error("Failed to fetch courses. Please try again later.");
        setAllCourses([]);
      })
  }, []);


  const topCourses = allCourses.slice(0, 6);

  const filteredCourses = allCourses.filter(course =>
    course.ccode.toLowerCase().includes(searchText.toLowerCase()) ||
    course.cname.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      key: 'sNo',
      width: 70,
      align: 'center',
    },
    {
      title: 'Course Code',
      dataIndex: 'ccode',
      key: 'ccode',
      sorter: (a, b) => a.ccode.localeCompare(b.code),
    },
    {
      title: 'Course Name',
      dataIndex: 'cname',
      key: 'cname',
      sorter: (a, b) => a.cname.localeCompare(b.name),
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      sorter: (a, b) => a.credits - b.credits,
    },
  ];

  const Head = () => (
    <section style={{
      backgroundColor: '#ffffff',
      padding: '15px 0',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <img src={EduflexLogo} alt='Eduflex Logo' style={{ height: '40px' }} />
          <span style={{
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500'
          }}>YOUR PATHWAY TO KNOWLEDGE</span>
        </div>
      </div>
    </section>
  );

  const handleAboutClick = (e) => {
    e.preventDefault();
    showPopup(<About />);
    setClick(false);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    showPopup(<LoginPopup setAuthState={setAuthState}/>);
    setClick(false);
  };

  const Header = () => (
    <>
      <Head />
      <header>
        <div className='container'>
          <nav className='nav-container'>
            <ul className={click ? "mobile-nav active" : "nav-menu"}>
              <li><Link to='/' onClick={() => setClick(false)}>Home</Link></li>
              <li><Link to='/courses' onClick={() => setClick(false)}>Courses</Link></li>
              <li><Link to='/facultys' onClick={() => setClick(false)}>Faculty</Link></li>
              <li><a href="#about" onClick={handleAboutClick}>About</a></li>
            </ul>
            <div style={{ padding: '8px 20px' }}>
              <a href="#login" onClick={handleLoginClick} style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '500',
                padding: '8px 20px'
              }}>Login</a>
            </div>
            <button onClick={() => setClick(!click)} style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#1e293b',
              cursor: 'pointer'
            }}>
              {click ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
            </button>
          </nav>
        </div>
      </header>
    </>
  );

  const Heading = ({ subtitle, title }) => (
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <h3 style={{
        fontSize: '1rem',
        color: '#2563eb',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '10px'
      }}>{subtitle}</h3>
      <h1 style={{ fontSize: '2.2rem', color: '#1e293b' }}>{title}</h1>
    </div>
  );

  const CoursesTable = () => (
    <section style={{ padding: '60px 0 40px' }}>
      <div className="container">
      <Heading subtitle="This Are Our" title="Courses" />
        <div style={{
          position: 'relative',
          marginBottom: '30px',
          maxWidth: '600px'
        }}>
          <Input
            placeholder="Search Course by ID or Name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px 12px 40px',
              fontSize: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>
        <div>

        </div>
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="sNo"
          bordered
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} courses`,
          }}
          style={{
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          components={{
            header: {
              cell: (props) => (
                <th {...props} style={{ 
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: '600',
                  borderBottom: 'none',
                  padding: '12px 16px'
                }} />
              ),
            },
          }}
        />
      </div>
    </section>
  );

  const TopCourses = () => (
    <section style={{
      padding: '40px 0 60px',
      backgroundColor: '#f8fafc'
    }}>
      <div className="container">
        <Heading subtitle="RECOMMENDED" title="Top Courses" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px'
        }}>
          {topCourses.map((course, index) => (
            <div key={index} style={{
              backgroundColor: '#ffffff',
              padding: '25px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'all 0.3s ease',
              border: '1px solid #e2e8f0'
            }}>
              <div>
                <h3 style={{ marginBottom: '5px' }}>{course.code}</h3>
                <p style={{ color: '#1e293b', fontWeight: '500' }}>{course.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer style={{
      backgroundColor: '#1e293b',
      color: '#ffffff',
      padding: '60px 0 0'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>EDUFLEX</h1>
            <span style={{
              display: 'block',
              marginBottom: '15px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>YOUR PATHWAY TO KNOWLEDGE</span>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Empowering learners worldwide with accessible education.</p>
          </div>
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '20px',
              position: 'relative',
              paddingBottom: '10px'
            }}>
              Quick Links
              <span style={{
                content: '',
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '40px',
                height: '2px',
                backgroundColor: '#2563eb'
              }}></span>
            </h3>
            <ul>
              <li><Link to='/' onClick={() => setClick(false)}>Home</Link></li>
              <li><Link to='/courses' onClick={() => setClick(false)}>Courses</Link></li>
              <li><Link to='/facultys' onClick={() => setClick(false)}>Faculty</Link></li>
              <li><a href="#about" onClick={handleAboutClick}>About</a></li>
            </ul>
          </div>
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '20px',
              position: 'relative',
              paddingBottom: '10px'
            }}>
              Contact Us
              <span style={{
                content: '',
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '40px',
                height: '2px',
                backgroundColor: '#2563eb'
              }}></span>
            </h3>
            <ul>
              <li style={{ marginBottom: '12px' }}>
                <i className='fa fa-phone-alt' style={{ marginRight: '10px', color: '#2563eb' }}></i>
                +91 6309876645
              </li>
              <li style={{ marginBottom: '12px' }}>
                <i className='fa fa-envelope' style={{ marginRight: '10px', color: '#2563eb' }}></i>
                info@eduflex.com
              </li>
              <li style={{ marginBottom: '12px' }}>
                <i className='fa fa-map-marker-alt' style={{ marginRight: '10px', color: '#2563eb' }}></i>
                Hyderabad, India
              </li>
            </ul>
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '20px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem'
        }}>
          <p>&copy; {new Date().getFullYear()} Eduflex | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />
      <main style={{ flex: '1' }}>
        <CoursesTable />
        <TopCourses />
      </main>
      <Footer />
      <PopupWrapper />
    </div>
  );
};

export default AllCourses;