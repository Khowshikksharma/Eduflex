import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Tag, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import usePopup from '../../components/usePopup';
import AdminAddCourse from './AdminAddCourse';
import AdminEditCourse from './AdminEditCourse';
import axios from 'axios';
import config from '../../config';

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
    axios.get(`${config.url}/admin/viewCourses`)
      .then((response) => {
        const coursesData = response.data;
        if (Array.isArray(coursesData)) {
          const mappedCourses = coursesData.map(c => ({
            courseCode: c.ccode,
            courseName: c.cname,
            courseShortName: c.cshortname,
            academicYear: c.academicYear,
            semester: c.semester,
            credits: c.credits,
            department: c.department,
            status: c.status
          }));
          setCourses(mappedCourses);
        } else {
          setCourses([]);
          console.warn('API response is not an array:', coursesData);
        }
      })
      .catch((error) => {
        message.error('Failed to fetch courses');
        console.error('Error fetching courses:', error);
        setCourses([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddCourse = () => {
    showPopup(
      <AdminAddCourse
        departments={departments}
        onSuccess={(newCourse) => {
          const mapped = {
            courseCode: newCourse.ccode,
            courseName: newCourse.cname,
            courseShortName: newCourse.cshortname,
            academicYear: newCourse.academicYear,
            semester: newCourse.semester,
            credits: newCourse.credits,
            department: newCourse.department,
            status: newCourse.status
          };
          setCourses([...courses, mapped]);
          message.success('Course added successfully!');
        }}
        closePopup={closePopup}
      />
    );
  };

  const handleEditCourse = (record) => {
    showPopup(
      <AdminEditCourse
        courseData={{
          ccode: record.courseCode,
          cname: record.courseName,
          cshortname: record.courseShortName,
          academicYear: record.academicYear,
          semester: record.semester,
          credits: record.credits,
          department: record.department,
          status: record.status
        }}
        departments={departments}
        onUpdate={(updatedCourse) => {
          const mapped = {
            courseCode: updatedCourse.ccode,
            courseName: updatedCourse.cname,
            courseShortName: updatedCourse.cshortname,
            academicYear: updatedCourse.academicYear,
            semester: updatedCourse.semester,
            credits: updatedCourse.credits,
            department: updatedCourse.department,
            status: updatedCourse.status
          };
          setCourses(courses.map(c =>
            c.courseCode === mapped.courseCode ? mapped : c
          ));
          message.success('Course updated successfully!');
        }}
        onClose={closePopup}
      />
    );
  };

  const handleDeleteCourse = async (record) => {
      const response = await axios.put(`${config.url}/admin/changeCourseStatus`, {
        ccode: record.courseCode,
        status: !record.status // Toggle status
      });
      if (response.status === 200) {
        setCourses(courses.map(c =>
          c.courseCode === record.courseCode ? { ...c, status: !c.status } : c
        ));
        message.success('Course status updated successfully!');
      } else {
        message.error('Failed to update course status');
      }
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
      align: 'center',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
      sorter: (a, b) => a.courseName.localeCompare(b.courseName),
      align: 'center',
    },
    {
      title: 'Course Short-Name',
      dataIndex: 'courseShortName',
      key: 'courseShortName',
      sorter: (a, b) => (a.courseShortName || '').localeCompare(b.courseShortName || ''),
      align: 'center',
    },
    {
      title: 'Academic Year',
      dataIndex: 'academicYear',
      key: 'academicYear',
      sorter: (a, b) => a.academicYear.localeCompare(b.academicYear),
      align: 'center',
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      sorter: (a, b) => a.semester - b.semester,
      align: 'center',
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      sorter: (a, b) => a.credits - b.credits,
      align: 'center',
    },
    {
      title: 'L-T-P-S',
      key: 'ltps',
      render: (_, record) => calculateLTP(record.credits),
      align: 'center',
    },
    {
      title: 'Departments',
      dataIndex: 'department',
      key: 'department',
      filters: departments.map(dept => ({ text: dept, value: dept })),
      onFilter: (value, record) => record.department === value,
      sorter: (a, b) => a.department.localeCompare(b.department),
      align: 'center',
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
      align: 'center',
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
          // pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} courses`,
        }}
      />
      <PopupWrapper />
    </div>
  );
};

export default AdminCourseList;
