import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Tag, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import usePopup from '../../components/usePopup';
import AdminAddCourse from './AdminAddCourse';
import AdminEditCourse from './AdminEditCourse';

const departments = [
  'CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'ChE', 'AE', 
  'ASE', 'AUT', 'AGE', 'BIO', 'BME', 'CEE', 'CER'
];

const AdminCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const { showPopup, closePopup, PopupWrapper } = usePopup();

  const calculateLTP = (credits) => {
    let remainingCredits = credits;
    const result = { L: 0, T: 0, P: 0, S: 0 };
    
    result.L = Math.floor(remainingCredits / 1.75);
    remainingCredits = remainingCredits % 1.75;
    
    if (remainingCredits >= 1.5) {
      result.P = Math.floor(remainingCredits / 1.5);
      remainingCredits = remainingCredits % 1.5;
    }
    
    if (remainingCredits >= 0.25) {
      result.T = Math.floor(remainingCredits / 0.25);
      remainingCredits = remainingCredits % 0.25;
    }
    
    if (remainingCredits > 0) {
      result.S += 1;
    }
    
    return `${result.L}-${result.T}-${result.P}-${result.S}`;
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCourses([
        {
          courseCode: 'CS101',
          courseName: 'Introduction to Computer Science',
          courseShortName: 'CS',
          academicYear: '2023-2024',
          semester: '1',
          credits: 4,
          status: true,
          department: 'CSE'
        },
        {
          courseCode: 'MA201',
          courseName: 'Advanced Mathematics',
          courseShortName: 'Math',
          academicYear: '2023-2024',
          semester: '2',
          credits: 3,
          status: true,
          department: 'CSE'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddCourse = () => {
    showPopup(
      <AdminAddCourse 
        departments={departments}
        onSuccess={(newCourse) => {
          setCourses([...courses, newCourse]);
          message.success('Course added successfully!');
        }}
      />
    );
  };

  const handleEditCourse = (record) => {
    showPopup(
      <AdminEditCourse 
        courseData={record}
        departments={departments}
        onUpdate={(updatedCourse) => {
          setCourses(courses.map(c => 
            c.courseCode === updatedCourse.courseCode ? updatedCourse : c
          ));
          message.success('Course updated successfully!');
        }}
        onClose={closePopup}
      />
    );
  };

  const handleDeleteCourse = (record) => {
    Modal.confirm({
      title: 'Confirm Status Change',
      content: `Are you sure you want to change ${record.courseName}'s status to Inactive?`,
      okText: 'Yes, Make Inactive',
      cancelText: 'Cancel',
      onOk: () => {
        const updatedCourses = courses.map(c => 
          c.courseCode === record.courseCode ? { ...c, status: false } : c
        );
        setCourses(updatedCourses);
        message.success(`${record.courseName}'s status changed to Inactive`);
      }
    });
  };

  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchText.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'S.No',
      key: 'sno',
      render: (text, record, index) => index + 1,
      width: 70,
      align: 'center',
    },
    {
      title: 'Course Code',
      dataIndex: 'courseCode',
      key: 'courseCode',
      sorter: (a, b) => a.courseCode.localeCompare(b.courseCode),
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
      sorter: (a, b) => a.courseName.localeCompare(b.courseName),
    },
    {
      title: 'Course Short-Name',
      dataIndex: 'courseShortName',
      key: 'courseShortName',
      sorter: (a, b) => (a.courseShortName || '').localeCompare(b.courseShortName || ''),
    },
    {
      title: 'Academic Year',
      dataIndex: 'academicYear',
      key: 'academicYear',
      sorter: (a, b) => a.academicYear.localeCompare(b.academicYear),
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      sorter: (a, b) => a.semester - b.semester,
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      sorter: (a, b) => a.credits - b.credits,
    },
    {
      title: 'L-T-P-S',
      key: 'ltps',
      render: (_, record) => calculateLTP(record.credits),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: departments.map(dept => ({ text: dept, value: dept })),
      onFilter: (value, record) => record.department === value,
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Action → Edit/Delete',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => handleEditCourse(record)}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDeleteCourse(record)}
            disabled={!record.status}
          >
            {record.status ? 'Make Inactive' : 'Inactive'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h1 style={{ margin: 0 }}>Course List</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input
            placeholder="Search by course name or code"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddCourse}
          >
            Add Course
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCourses}
        rowKey="courseCode"
        loading={loading}
        scroll={{ x: 'max-content' }}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} courses`,
        }}
      />
      <PopupWrapper />
    </div>
  );
};

export default AdminCourseList;