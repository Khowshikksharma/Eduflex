import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Tag, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import usePopup from '../../components/usePopup';
import AdminAddStudent from './AdminAddStudent';
import AdminEditStudent from './AdminEditStudent';
import axios from 'axios';
import config from '../../config';

const departments = [
  'CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'ChE', 'AE', 
  'ASE', 'AUT', 'AGE', 'BIO', 'BME', 'CEE', 'CER'
];

const semesterFees = [
  { value: 130000, label: '₹130,000' },
  { value: 115000, label: '₹115,000' },
  { value: 100000, label: '₹100,000' },
  { value: 90000, label: '₹90,000' }
];

const qualifications = [
  '10th Grade',
  '12th Grade',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree'
];

const maritalStatuses = ['Single', 'Married', 'Divorced'];

const AdminStudentList = () => {
  const [students, setStudents] = useState([]); // Already initialized as empty array
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const { showPopup, closePopup, PopupWrapper } = usePopup();

  useEffect(() => {
    setLoading(true);
    axios.get(`${config.url}/admin/viewstudents`)
      .then((response) => {
        // Ensure we always set an array, even if response.data is null/undefined
        const studentsData = response.data;
        if (Array.isArray(studentsData)) {
          setStudents(studentsData);
        } else {
          setStudents([]);
          console.warn('API response is not an array:', studentsData);
        }
      })
      .catch((error) => {
        message.error('Failed to fetch students');
        console.error('Error fetching students:', error);
        setStudents([]); // Ensure students is always an array even on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddStudent = () => {
    showPopup(
      <AdminAddStudent 
        departments={departments}
        semesterFees={semesterFees}
        qualifications={qualifications}
        maritalStatuses={maritalStatuses}
        onSuccess={(newStudent) => {
          setStudents([...students, newStudent]);
          message.success('Student added successfully!');
        }}
        closePopup={closePopup}
      />
    );
  };

  const handleEditStudent = (record) => {
    showPopup(
      <AdminEditStudent 
        studentData={record}
        departments={departments}
        semesterFees={semesterFees}
        qualifications={qualifications}
        maritalStatuses={maritalStatuses}
        onUpdate={(updatedStudent) => {
          setStudents(students.map(s => 
            s.id === updatedStudent.id ? updatedStudent : s
          ));
          message.success('Student updated successfully!');
        }}
        onClose={closePopup}
      />
    );
  };

  const handleDeleteStudent = (record) => {
    Modal.confirm({
      title: 'Confirm Status Change',
      content: `Are you sure you want to change ${record.name}'s status to Inactive?`,
      okText: 'Yes, Make Inactive',
      cancelText: 'Cancel',
      onOk: () => {
        try {
          const updatedStudents = students.map(s => 
            s.id === record.id ? { ...s, status: false } : s
          );
          setStudents(updatedStudents);
          message.success(`${record.name}'s status changed to Inactive`);
        } catch (error) {
          console.error('Error updating student status:', error);
          message.error('Failed to update student status');
        }
      },
      onCancel: () => {
        // Handle cancel if needed
      }
    });
  };

  // Add safety check to ensure students is always an array before filtering
  const filteredStudents = Array.isArray(students) ? students.filter(student => 
    student.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    student.id?.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

  const columns = [
    {
      title: 'S.No',
      key: 'sno',
      render: (text, record, index) => index + 1,
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
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: departments.map(dept => ({ text: dept, value: dept })),
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' },
        { text: 'Other', value: 'Other' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone No.',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Aadhaar No.',
      dataIndex: 'aadhaarNo',
      key: 'aadhaarNo',
    },
    {
      title: 'Semester Fee',
      dataIndex: 'semesterFee',
      key: 'semesterFee',
      render: fee => `₹${fee?.toLocaleString('en-IN') || 0}`,
      sorter: (a, b) => (a.semesterFee || 0) - (b.semesterFee || 0),
    },
    {
      title: 'Qualification',
      dataIndex: 'qualification',
      key: 'qualification',
      filters: qualifications.map(qual => ({ text: qual, value: qual })),
      onFilter: (value, record) => record.qualification === value,
    },
    {
      title: 'Father Name',
      dataIndex: 'fatherName',
      key: 'fatherName',
    },
    {
      title: 'Start Year',
      dataIndex: 'startYear',
      key: 'startYear',
      sorter: (a, b) => (a.startYear || 0) - (b.startYear || 0),
    },
    {
      title: 'End Year',
      dataIndex: 'endYear',
      key: 'endYear',
      sorter: (a, b) => (a.endYear || 0) - (b.endYear || 0),
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
      title: 'Current Year',
      dataIndex: 'currentYear',
      key: 'currentYear',
      render: year => `${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`,
      sorter: (a, b) => (a.currentYear || 0) - (b.currentYear || 0),
    },
    {
      title: 'Current Semester',
      dataIndex: 'currentSemester',
      key: 'currentSemester',
      render: semester => `Semester ${semester}`,
      sorter: (a, b) => (a.currentSemester || 0) - (b.currentSemester || 0),
    },
    {
      title: 'Marital Status',
      dataIndex: 'maritalStatus',
      key: 'maritalStatus',
      filters: maritalStatuses.map(status => ({ text: status, value: status })),
      onFilter: (value, record) => record.maritalStatus === value,
    },
    {
      title: 'Mother Tongue',
      dataIndex: 'motherTongue',
      key: 'motherTongue',
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Action → Edit/Delete',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => handleEditStudent(record)}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDeleteStudent(record)}
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
        <h1 style={{ margin: 0 }}>Student List</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input
            placeholder="Search by name or ID"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddStudent}
          >
            Add Student
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredStudents}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} students`,
        }}
      />
      <PopupWrapper />
    </div>
  );
};

export default AdminStudentList;