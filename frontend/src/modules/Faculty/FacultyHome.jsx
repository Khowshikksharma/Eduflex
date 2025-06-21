import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Progress, Tag, Badge, Avatar } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  TrophyOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  StarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const FacultyHome = () => {
  const[facultyData,setFacultyData] = useState({});
    const storedData = sessionStorage.getItem('faculty');
    useEffect(() =>{
      if(storedData){
        const parsedData = JSON.parse(storedData);
        setFacultyData(parsedData);
      }
    },[storedData])
    
  // Faculty profile data
  const facultyProfile = {
    name: facultyData.name || '',
    id: facultyData.id || '',
    department: facultyData.department || '',
    designation: facultyData.designation || '',
    email: facultyData.email || '',
    avatarColor: "#1890ff"
  };

  // Statistics data
  const stats = [
    {
      title: 'Courses Teaching',
      value: '5',
      icon: <BookOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff',
      progress: 100
    },
    {
      title: 'Students Mapped',
      value: '142',
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a',
      progress: 85
    },
    {
      title: 'Research Papers',
      value: '18',
      icon: <FileTextOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      color: '#faad14',
      progress: 75
    },
    {
      title: 'Years of Service',
      value: '8',
      icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#f5222d' }} />,
      color: '#f5222d',
      progress: 40
    }
  ];

  // Achievements data
  const achievements = [
    {
      id: 1,
      title: "Best Teacher Award 2023",
      type: "award",
      date: "15 May 2023",
      description: "University level recognition for teaching excellence"
    },
    {
      id: 2,
      title: "Research Grant ($50,000)",
      type: "grant",
      date: "10 March 2023",
      description: "NSF grant for AI in Education research"
    },
    {
      id: 3,
      title: "Paper Published in IEEE",
      type: "publication",
      date: "22 January 2023",
      description: "Paper on 'Neural Networks for Predictive Analysis'"
    },
    {
      id: 4,
      title: "Keynote Speaker at TechConf",
      type: "recognition",
      date: "5 December 2022",
      description: "Invited speaker at international conference"
    }
  ];

  // Upcoming events data
  const upcomingEvents = [
    {
      key: '1',
      event: 'Department Meeting',
      date: 'Today, 3:00 PM',
      location: 'CS Department, Room 205'
    },
    {
      key: '2',
      event: 'Thesis Defense - John Smith',
      date: 'Tomorrow, 10:00 AM',
      location: 'Virtual (Zoom)'
    },
    {
      key: '3',
      event: 'Final Grades Due',
      date: 'May 15, 2023',
      location: 'Online Portal'
    },
    {
      key: '4',
      event: 'Faculty Development Workshop',
      date: 'May 20, 2023',
      location: 'Administration Building'
    }
  ];

  // Student performance data
  const performanceData = {
    labels: ['A', 'B', 'C', 'D', 'F'],
    datasets: [
      {
        label: 'Student Grades Distribution',
        data: [25, 30, 20, 15, 10],
        backgroundColor: [
          '#52c41a',
          '#1890ff',
          '#faad14',
          '#ff7a45',
          '#f5222d'
        ],
        borderWidth: 1
      }
    ]
  };

  // Course evaluation data
  const evaluationData = {
    labels: ['CS101', 'CS201', 'CS301', 'CS401', 'CS501'],
    datasets: [
      {
        label: 'Course Evaluation Scores',
        data: [4.7, 4.5, 4.8, 4.6, 4.9],
        backgroundColor: '#1890ff',
        borderColor: '#1890ff',
        borderWidth: 2
      }
    ]
  };

  // Table columns for upcoming events
  const eventColumns = [
    {
      title: 'Event',
      dataIndex: 'event',
      key: 'event',
      render: (text) => <a>{text}</a>
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location'
    }
  ];

  // Table columns for achievements
  const achievementColumns = [
    {
      title: 'Achievement',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.description}</div>
        </div>
      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        let color = '';
        switch(type) {
          case 'award': color = 'gold'; break;
          case 'grant': color = 'green'; break;
          case 'publication': color = 'blue'; break;
          default: color = 'purple';
        }
        return (
          <Tag color={color} style={{ textTransform: 'capitalize' }}>
            {type}
          </Tag>
        );
      },
      width: 100
    }
  ];

  return (
    <div style={{ 
      padding: '24px', 
      background: '#f0f2f5', 
      minHeight: '100%',
      overflowX: 'hidden'
    }}>
      {/* Faculty Profile Header */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '10px', 
        padding: '20px', 
        marginBottom: '24px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Avatar 
          size={64} 
          icon={<UserOutlined />} 
          style={{ 
            backgroundColor: facultyProfile.avatarColor,
            marginRight: '20px'
          }} 
        />
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>{facultyProfile.name}</h1>
          <div style={{ color: '#666', marginTop: '4px' }}>
            <Tag color="blue">{facultyProfile.id}</Tag>
            <Tag color="geekblue">{facultyProfile.department}</Tag>
            <Tag color="cyan">{facultyProfile.designation}</Tag>
          </div>
          <div style={{ color: '#666', marginTop: '8px' }}>
            <UserOutlined style={{ marginRight: '5px' }} />
            {facultyProfile.email}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={12} lg={6}>
            <Card
              style={{ 
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s',
                borderLeft: `4px solid ${stat.color}`,
                height: '100%'
              }}
              bodyStyle={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px'
              }}
              hoverable
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>{stat.title}</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{stat.value}</span>
                <Progress
                  percent={stat.progress}
                  showInfo={false}
                  strokeColor={stat.color}
                  trailColor="#f0f0f0"
                  strokeWidth={5}
                />
              </div>
              <div style={{ fontSize: '36px', color: stat.color }}>{stat.icon}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* First Row - Charts */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <BarChartOutlined style={{ marginRight: '8px' }} />
                Student Grades Distribution
              </span>
            }
            style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            <div style={{ height: '300px' }}>
              <Pie
                data={performanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <StarOutlined style={{ marginRight: '8px' }} />
                Course Evaluation Scores
              </span>
            }
            style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            <div style={{ height: '300px' }}>
              <Bar
                data={evaluationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 5,
                      ticks: {
                        stepSize: 0.5
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Second Row - Achievements and Upcoming Events */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <TrophyOutlined style={{ marginRight: '8px' }} />
                Recent Achievements
              </span>
            }
            style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            <Table
              columns={achievementColumns}
              dataSource={achievements}
              pagination={false}
              size="middle"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <CalendarOutlined style={{ marginRight: '8px' }} />
                Upcoming Events
              </span>
            }
            style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            <Table
              columns={eventColumns}
              dataSource={upcomingEvents}
              pagination={false}
              size="middle"
              rowKey="key"
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Card
        title={
          <span>
            <CheckCircleOutlined style={{ marginRight: '8px' }} />
            Recent Activities
          </span>
        }
        style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge status="success" style={{ marginRight: '16px' }} />
            <div>
              <div>Submitted grades for CS301 - Final Exam</div>
              <div style={{ color: '#666', fontSize: '12px' }}>2 hours ago</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge status="processing" style={{ marginRight: '16px' }} />
            <div>
              <div>Uploaded lecture materials for Week 12</div>
              <div style={{ color: '#666', fontSize: '12px' }}>1 day ago</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge status="success" style={{ marginRight: '16px' }} />
            <div>
              <div>Completed student advising sessions</div>
              <div style={{ color: '#666', fontSize: '12px' }}>3 days ago</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge status="default" style={{ marginRight: '16px' }} />
            <div>
              <div>Department meeting minutes reviewed</div>
              <div style={{ color: '#666', fontSize: '12px' }}>1 week ago</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FacultyHome;