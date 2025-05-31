import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./landingstyle.css";
import EduflexLogo from '../assets/edufelxlogo.jpg';
import usePopup from '../components/usePopup';
import About from './About';
import LoginPopup from './LoginPopup';
import { Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const Faculty = () => {
  const [click, setClick] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { showPopup, PopupWrapper } = usePopup();

  const allFaculty = [
    { sNo: 1, id: "CSE001", name: "Dr. John Smith", gender: "Male", department: "Computer Science" },
    { sNo: 2, id: "ECE002", name: "Dr. Sarah Johnson", gender: "Female", department: "Electronics" },
    { sNo: 3, id: "ME003", name: "Dr. Michael Chen", gender: "Male", department: "Mechanical" },
    { sNo: 4, id: "CSE004", name: "Dr. Robert Williams", gender: "Male", department: "Computer Science" },
    { sNo: 5, id: "ECE005", name: "Dr. Emily Davis", gender: "Female", department: "Electronics" },
    { sNo: 6, id: "ME006", name: "Dr. James Brown", gender: "Male", department: "Mechanical" },
    { sNo: 7, id: "CSE007", name: "Dr. Patricia Miller", gender: "Female", department: "Computer Science" },
    { sNo: 8, id: "ECE008", name: "Dr. Thomas Wilson", gender: "Male", department: "Electronics" },
    { sNo: 9, id: "ME009", name: "Dr. Jennifer Moore", gender: "Female", department: "Mechanical" },
    { sNo: 10, id: "CSE010", name: "Dr. David Taylor", gender: "Male", department: "Computer Science" },
    { sNo: 11, id: "ECE011", name: "Dr. Jessica Anderson", gender: "Female", department: "Electronics" },
    { sNo: 12, id: "ME012", name: "Dr. Charles Thomas", gender: "Male", department: "Mechanical" },
  ];

  const filteredFaculty = allFaculty.filter(faculty =>
    faculty.id.toLowerCase().includes(searchText.toLowerCase()) ||
    faculty.name.toLowerCase().includes(searchText.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchText.toLowerCase())
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
      filters: [
        { text: 'Computer Science', value: 'Computer Science' },
        { text: 'Electronics', value: 'Electronics' },
        { text: 'Mechanical', value: 'Mechanical' },
      ],
      onFilter: (value, record) => record.department === value,
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
    showPopup(<LoginPopup />);
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

  const FacultyTable = () => (
    <section style={{ padding: '60px 0' }}>
      <div className="container">
        <Heading subtitle="MEET OUR" title="Faculty Members" />
        <div style={{
          position: 'relative',
          marginBottom: '30px',
          maxWidth: '600px'
        }}>
          <Input
            placeholder="Search Faculty by ID or Name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px 12px 40px',
              fontSize: '16px',
            }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredFaculty}
          rowKey="sNo"
          bordered
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} faculty members`,
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
        <FacultyTable />
      </main>
      <Footer />
      <PopupWrapper />
    </div>
  );
};

export default Faculty;