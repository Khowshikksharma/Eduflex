import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Progress } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  BankOutlined,
  LineChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import config from './../../config';
import axios from 'axios';

const AdminHome = () => {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await axios.get(`${config.url}/admin/analysis`);
      setCounts(response.data);
    } catch (error) {
      console.error(error.message)
    }
  };

  // Statistics data
  const stats = [
  {
    title: 'Total Students',
    value: counts ? counts.studentCount.toLocaleString() : '...',
    icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
    color: '#1890ff',
    progress: counts ? Math.min(100, Math.round((counts.studentCount / 1500) * 100)) : 0
  },
  {
    title: 'Total Faculty',
    value: counts ? counts.facultyCount.toLocaleString() : '...',
    icon: <TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
    color: '#52c41a',
    progress: counts ? Math.min(100, Math.round((counts.facultyCount / 100) * 100)) : 0
  },
  {
    title: 'Active Courses',
    value: '42',
    icon: <BookOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
    color: '#faad14',
    progress: 85
  },
  {
    title: 'Departments',
    value: '8',
    icon: <BankOutlined style={{ fontSize: '24px', color: '#f5222d' }} />,
    color: '#f5222d',
    progress: 92
  }
  ];


  // Recent activities data
  const activities = [
    {
      key: '1',
      activity: 'New course "Advanced React" added',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      key: '2',
      activity: 'Faculty meeting scheduled',
      time: '5 hours ago',
      status: 'pending'
    },
    {
      key: '3',
      activity: 'System maintenance completed',
      time: '1 day ago',
      status: 'completed'
    },
    {
      key: '4',
      activity: 'New student batch enrolled',
      time: '2 days ago',
      status: 'completed'
    },
    {
      key: '5',
      activity: 'Course evaluation reports due',
      time: '3 days ago',
      status: 'pending'
    }
  ];

  // Departments distribution data
  const departmentsData = {
    labels: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AERO', 'AI/ML', 'IT'],
    datasets: [
      {
        data: [320, 180, 150, 120, 90, 80, 210, 140],
        backgroundColor: [
          '#1890ff',
          '#36cfc9',
          '#faad14',
          '#f759ab',
          '#52c41a',
          '#722ed1',
          '#fa8c16',
          '#f5222d'
        ],
        borderWidth: 1
      }
    ]
  };

  // Enrollment trend data
  const enrollmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'New Students',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: '#1890ff',
        borderColor: '#1890ff',
        borderWidth: 2
      },
      {
        label: 'New Faculty',
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: '#52c41a',
        borderColor: '#52c41a',
        borderWidth: 2
      }
    ]
  };

  // Student and Faculty Status data
  const statusData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Students Present',
        data: [85, 79, 82, 88, 90, 75],
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Faculty Present',
        data: [95, 89, 92, 98, 96, 85],
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Table columns
  const columns = [
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
      render: (text) => <a>{text}</a>
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'completed' ? '#52c41a' : '#faad14' }}>
          {status === 'completed' ? (
            <CheckCircleOutlined style={{ marginRight: 5 }} />
          ) : (
            <CalendarOutlined style={{ marginRight: 5 }} />
          )}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    }
  ];

  return (
    <div style={{ 
      padding: '24px', 
      background: '#f0f2f5', 
      minHeight: '100%',
      overflowX: 'hidden'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        marginBottom: '24px', 
        color: '#333',
        display: 'flex',
        alignItems: 'center'
      }}>
        <LineChartOutlined style={{ marginRight: '10px' }} />
        Dashboard Overview
      </h1>

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

      {/* First Row - Two equal height charts */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            height: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#333',
              display: 'flex',
              alignItems: 'center'
            }}>
              <TeamOutlined style={{ marginRight: '10px' }} />
              Enrollment Trend
            </h3>
            <div style={{ flex: 1, position: 'relative' }}>
              <Bar
                data={enrollmentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            height: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#333',
              display: 'flex',
              alignItems: 'center'
            }}>
              <BankOutlined style={{ marginRight: '10px' }} />
              Departments Distribution
            </h3>
            <div style={{ flex: 1, position: 'relative' }}>
              <Pie
                data={departmentsData}
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
          </div>
        </Col>
      </Row>

      {/* Second Row - Full width chart */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            height: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#333',
              display: 'flex',
              alignItems: 'center'
            }}>
              <UserOutlined style={{ marginRight: '10px' }} />
              Weekly Attendance Status
            </h3>
            <div style={{ flex: 1, position: 'relative' }}>
              <Line
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top'
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      min: 50,
                      max: 100,
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Recent Activities Table */}
      <div style={{
        background: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333',
          display: 'flex',
          alignItems: 'center'
        }}>
          <CalendarOutlined style={{ marginRight: '10px' }} />
          Recent Activities
        </h3>
        <Table
          columns={columns}
          dataSource={activities}
          pagination={false}
          size="middle"
          rowKey="key"
        />
      </div>
    </div>
  );
};

export default AdminHome;