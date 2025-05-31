import React from 'react';
import { Card, Row, Col, Table, Tag, Avatar, Divider, Badge } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  ScheduleOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const StudentHome = () => {
  // Student information
  const studentInfo = {
    name: 'John Michael Doe',
    id: 'STU2023001',
    department: 'Computer Science',
    semester: '5th Semester',
    email: 'john.doe@university.edu',
    contact: '+1 234 567 8901'
  };

  // Courses registered
  const courses = [
    { id: 'CS501', name: 'Advanced Algorithms', credits: 4, marks: 85, status: 'completed' },
    { id: 'CS502', name: 'Database Systems', credits: 3, marks: 78, status: 'completed' },
    { id: 'CS503', name: 'Machine Learning', credits: 4, marks: 92, status: 'completed' },
    { id: 'CS504', name: 'Cloud Computing', credits: 3, marks: 88, status: 'completed' },
    { id: 'CS505', name: 'Software Engineering', credits: 4, marks: 76, status: 'completed' },
    { id: 'CS506', name: 'Artificial Intelligence', credits: 4, marks: 95, status: 'in-progress' },
    { id: 'CS507', name: 'Big Data Analytics', credits: 3, marks: 0, status: 'upcoming' }
  ];

  // Achievements
  const achievements = [
    { id: 1, title: 'Dean\'s List', description: 'Top 5% of the class', date: '2023-05-15', icon: <TrophyOutlined />, color: 'gold' },
    { id: 2, title: 'Hackathon Winner', description: '1st place in CodeFest 2023', date: '2023-03-20', icon: <StarOutlined />, color: 'blue' },
    { id: 3, title: 'Research Grant', description: 'Awarded for AI research project', date: '2023-01-10', icon: <CheckCircleOutlined />, color: 'green' }
  ];

  // Upcoming deadlines
  const deadlines = [
    { id: 1, course: 'Artificial Intelligence', task: 'Assignment 3', due: '2023-11-15', status: 'pending' },
    { id: 2, course: 'Big Data Analytics', task: 'Project Proposal', due: '2023-11-20', status: 'pending' },
    { id: 3, course: 'Software Engineering', task: 'Final Report', due: '2023-11-25', status: 'completed' }
  ];

  // Notifications
  const notifications = [
    { id: 1, message: 'New material uploaded for Artificial Intelligence', time: '2 hours ago', read: false },
    { id: 2, message: 'Your grade for Database Systems has been updated', time: '1 day ago', read: true },
    { id: 3, message: 'Reminder: Faculty meeting tomorrow at 10 AM', time: '2 days ago', read: true }
  ];

  // Chart data for marks
  const marksData = {
    labels: courses.filter(c => c.marks > 0).map(c => c.name),
    datasets: [
      {
        label: 'Marks Obtained',
        data: courses.filter(c => c.marks > 0).map(c => c.marks),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.1,
        fill: true
      }
    ]
  };

  return (
    <div style={{ 
      padding: '24px', 
      background: '#f0f2f5', 
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <h1 style={{ 
        fontSize: '28px', 
        marginBottom: '24px', 
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        fontWeight: '600'
      }}>
        <LineChartOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
        Student Dashboard
      </h1>

      {/* Student Profile Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12} lg={8}>
          <Card
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%',
              border: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Avatar 
                size={72} 
                icon={<UserOutlined />} 
                style={{ 
                  marginRight: '16px',
                  backgroundColor: '#1890ff',
                  fontSize: '28px'
                }} 
              />
              <div>
                <h2 style={{ 
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1a1a1a'
                }}>
                  {studentInfo.name}
                </h2>
                <p style={{ 
                  margin: '4px 0 0', 
                  color: '#666',
                  fontSize: '14px'
                }}>
                  {studentInfo.id}
                </p>
              </div>
            </div>
            <Divider style={{ margin: '16px 0', borderColor: '#f0f0f0' }} />
            <div style={{ lineHeight: '1.8' }}>
              <p style={{ margin: 0 }}>
                <strong style={{ display: 'inline-block', width: '100px', color: '#666' }}>Department:</strong> 
                <span style={{ color: '#1a1a1a' }}>{studentInfo.department}</span>
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ display: 'inline-block', width: '100px', color: '#666' }}>Semester:</strong> 
                <span style={{ color: '#1a1a1a' }}>{studentInfo.semester}</span>
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ display: 'inline-block', width: '100px', color: '#666' }}>Email:</strong> 
                <span style={{ color: '#1a1a1a' }}>{studentInfo.email}</span>
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ display: 'inline-block', width: '100px', color: '#666' }}>Contact:</strong> 
                <span style={{ color: '#1a1a1a' }}>{studentInfo.contact}</span>
              </p>
            </div>
          </Card>
        </Col>
        
        {/* Enhanced Courses Summary */}
        <Col xs={24} md={12} lg={16}>
          <Card
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%',
              border: 'none'
            }}
            title={
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '16px'
              }}>
                <BookOutlined style={{ 
                  marginRight: '10px', 
                  color: '#1890ff',
                  fontSize: '18px'
                }} />
                <span>Academic Summary</span>
              </div>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div style={{
                  background: '#f0f9ff',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ 
                    fontSize: '28px', 
                    margin: '0 0 4px',
                    color: '#1890ff'
                  }}>
                    {courses.filter(c => c.status === 'completed' || c.status === 'in-progress').length}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: '#666',
                    fontSize: '14px'
                  }}>Active Courses</p>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{
                  background: '#f6ffed',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ 
                    fontSize: '28px', 
                    margin: '0 0 4px',
                    color: '#52c41a'
                  }}>
                    {courses.filter(c => c.status === 'completed').length}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: '#666',
                    fontSize: '14px'
                  }}>Completed</p>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{
                  background: '#e6f7ff',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ 
                    fontSize: '28px', 
                    margin: '0 0 4px',
                    color: '#096dd9'
                  }}>
                    {courses.filter(c => c.status === 'in-progress').length}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: '#666',
                    fontSize: '14px'
                  }}>In Progress</p>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{
                  background: '#fff7e6',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ 
                    fontSize: '28px', 
                    margin: '0 0 4px',
                    color: '#fa8c16'
                  }}>
                    {courses.reduce((sum, course) => sum + course.credits, 0)}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: '#666',
                    fontSize: '14px'
                  }}>Total Credits</p>
                </div>
              </Col>
            </Row>
            
            <Divider style={{ margin: '16px 0', borderColor: '#f0f0f0' }} />
            
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ 
                margin: '0 0 8px',
                fontSize: '16px',
                color: '#666'
              }}>
                Current GPA: <span style={{ color: '#1a1a1a', fontWeight: '600' }}>3.78</span>
              </h3>
              <p style={{ 
                margin: 0,
                color: '#999',
                fontSize: '13px'
              }}>
                Based on {courses.filter(c => c.status === 'completed').length} completed courses
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Marks Chart */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%',
              border: 'none'
            }}
            title={
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '16px'
              }}>
                <LineChartOutlined style={{ 
                  marginRight: '10px', 
                  color: '#1890ff',
                  fontSize: '18px'
                }} />
                <span>Academic Performance</span>
              </div>
            }
          >
            <div style={{ height: '300px' }}>
              <Line
                data={marksData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleFont: { size: 14 },
                      bodyFont: { size: 12 },
                      padding: 12,
                      cornerRadius: 4
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                      },
                      title: {
                        display: true,
                        text: 'Marks (out of 100)',
                        color: '#666',
                        font: {
                          size: 12
                        }
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      },
                      title: {
                        display: true,
                        text: 'Courses',
                        color: '#666',
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Achievements and Deadlines */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Achievements */}
        <Col xs={24} md={12}>
          <Card
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%',
              border: 'none'
            }}
            title={
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '16px'
              }}>
                <TrophyOutlined style={{ 
                  marginRight: '10px', 
                  color: '#faad14',
                  fontSize: '18px'
                }} />
                <span>Recent Achievements</span>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {achievements.map(achievement => (
                <div key={achievement.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '16px',
                  borderRadius: '8px',
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s',
                  ':hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }
                }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: achievement.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                    color: 'white',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {achievement.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1a1a1a'
                    }}>
                      {achievement.title}
                    </h4>
                    <p style={{ 
                      margin: '4px 0',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      {achievement.description}
                    </p>
                    <p style={{ 
                      margin: 0,
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      Awarded on: {achievement.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        
        {/* Upcoming Deadlines */}
        <Col xs={24} md={12}>
          <Card
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%',
              border: 'none'
            }}
            title={
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '16px'
              }}>
                <ClockCircleOutlined style={{ 
                  marginRight: '10px', 
                  color: '#f5222d',
                  fontSize: '18px'
                }} />
                <span>Upcoming Deadlines</span>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {deadlines.map(deadline => (
                <div key={deadline.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  borderRadius: '8px',
                  background: deadline.status === 'completed' ? '#f6ffed' : '#fff7e6',
                  borderLeft: `4px solid ${deadline.status === 'completed' ? '#52c41a' : '#fa8c16'}`,
                  transition: 'all 0.3s',
                  ':hover': {
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <div>
                    <h4 style={{ 
                      margin: 0,
                      fontSize: '15px',
                      fontWeight: '500'
                    }}>
                      {deadline.task}
                    </h4>
                    <p style={{ 
                      margin: '4px 0',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      {deadline.course}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      margin: 0,
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      Due: {deadline.due}
                    </p>
                    <Tag 
                      color={deadline.status === 'completed' ? 'success' : 'warning'}
                      style={{ 
                        marginTop: '4px',
                        fontWeight: '500'
                      }}
                    >
                      {deadline.status === 'completed' ? 'Completed' : 'Pending'}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Sections */}
      <Row gutter={[24, 24]}>
        {/* Current Courses */}
        <Col xs={24} md={12}>
          <Card
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%',
              border: 'none'
            }}
            title={
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '16px'
              }}>
                <ScheduleOutlined style={{ 
                  marginRight: '10px', 
                  color: '#722ed1',
                  fontSize: '18px'
                }} />
                <span>Course Overview</span>
              </div>
            }
          >
            <Table
              columns={[
                {
                  title: 'Code',
                  dataIndex: 'id',
                  key: 'id',
                  width: 100
                },
                {
                  title: 'Course Name',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text) => <span style={{ fontWeight: '500' }}>{text}</span>
                },
                {
                  title: 'Credits',
                  dataIndex: 'credits',
                  key: 'credits',
                  align: 'center',
                  width: 90,
                  render: (credits) => <Tag color="blue">{credits}</Tag>
                },
                {
                  title: 'Marks',
                  dataIndex: 'marks',
                  key: 'marks',
                  render: (marks) => marks > 0 ? (
                    <span style={{ fontWeight: '500' }}>{marks}/100</span>
                  ) : '-',
                  align: 'center',
                  width: 100
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag 
                      color={
                        status === 'completed' ? 'green' : 
                        status === 'in-progress' ? 'blue' : 'orange'
                      }
                      style={{ fontWeight: '500' }}
                    >
                      {status === 'completed' ? 'Completed' : 
                       status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                    </Tag>
                  ),
                  align: 'center',
                  width: 120
                }
              ]}
              dataSource={courses}
              pagination={false}
              size="middle"
              rowKey="id"
              style={{ marginTop: '8px' }}
            />
          </Card>
        </Col>
        
        {/* Notifications */}
        <Col xs={24} md={12}>
          <Card
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%',
              border: 'none'
            }}
            title={
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '16px'
              }}>
                <NotificationOutlined style={{ 
                  marginRight: '10px', 
                  color: '#13c2c2',
                  fontSize: '18px'
                }} />
                <span>Recent Notifications</span>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map(notification => (
                <div key={notification.id} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderRadius: '8px',
                  background: notification.read ? '#fff' : '#f0f9ff',
                  position: 'relative',
                  transition: 'all 0.3s',
                  ':hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }
                }}>
                  {!notification.read && (
                    <Badge dot style={{ 
                      position: 'absolute', 
                      top: '16px', 
                      left: '16px',
                      backgroundColor: '#1890ff'
                    }} />
                  )}
                  <div style={{ marginLeft: notification.read ? '0' : '24px' }}>
                    <p style={{ 
                      margin: 0, 
                      fontWeight: notification.read ? 'normal' : '500',
                      color: notification.read ? '#666' : '#1a1a1a'
                    }}>
                      {notification.message}
                    </p>
                    <p style={{ 
                      margin: '4px 0 0', 
                      fontSize: '12px', 
                      color: '#999' 
                    }}>
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentHome;