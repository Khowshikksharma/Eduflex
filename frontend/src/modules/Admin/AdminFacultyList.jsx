import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Tag, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import usePopup from '../../components/usePopup';
import AdminAddFaculty from './AdminAddFaculty';
import AdminEditFaculty from './AdminEditFaculty';
import axios from 'axios';
import config from '../../config';

const departments = [
  'CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'ChE', 'AE', 
  'ASE', 'AUT', 'AGE', 'BIO', 'BME', 'CEE', 'CER'
];

const qualifications = [
  'B.Tech',
  'M.Tech',
  'Ph.D',
  'Post Doc'
];

const maritalStatuses = ['Single', 'Married', 'Divorced'];

const designations = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Visiting Faculty',
  'Adjunct Faculty'
];

const AdminFacultyList = () => {
  const [faculty, setFaculty] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const { showPopup, closePopup, PopupWrapper } = usePopup();

  useEffect(() => {
    setLoading(true);
    axios.get(`${config.url}/admin/viewfaculties`)
      .then((response) => {
        const facultyData = response.data;
        if (Array.isArray(facultyData)) {
          setFaculty(facultyData);
        } else {
          setFaculty([]);
          console.warn('API response is not an array:', facultyData);
        }
      })
      .catch((error) => { 
        message.error('Failed to fetch faculty data');
        console.error('Error fetching faculty:', error);
        setFaculty([]); 
      })  
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddFaculty = () => {
    showPopup(
      <AdminAddFaculty 
        departments={departments}
        qualifications={qualifications}
        maritalStatuses={maritalStatuses}
        designations={designations}
        onSuccess={(newFaculty) => {
          setFaculty([...faculty, newFaculty]);
          message.success('Faculty added successfully!');
        }}
        closePopup={closePopup}
      />
    );
  };

  const handleEditFaculty = (record) => {
    showPopup(
      <AdminEditFaculty 
        facultyData={record}
        departments={departments}
        qualifications={qualifications}
        maritalStatuses={maritalStatuses}
        designations={designations}
        onUpdate={(updatedFaculty) => {
          setFaculty(faculty.map(f => 
            f.id === updatedFaculty.id ? updatedFaculty : f
          ));
          message.success('Faculty updated successfully!');
        }}
        onClose={closePopup}
      />
    );
  };

  const handleDeleteFaculty = async (record) => {
    const response = await axios.put(`${config.url}/admin/changeFacultyStatus`, {
      id: record.id,
      status: !record.status // Toggle status
    });
    if (response.status === 200) {
      setFaculty(faculty.map(f => 
        f.id === record.id ? { ...f, status: !f.status } : f
      ));
      message.success('Faculty status updated successfully!');
    } else {
      message.error('Failed to update faculty status');
    }
  };

  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchText.toLowerCase()) ||
    f.id.toLowerCase().includes(searchText.toLowerCase())
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
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: salary => `₹${salary.toLocaleString('en-IN')}`,
      sorter: (a, b) => a.salary - b.salary,
    },
    {
      title: 'Qualification',
      dataIndex: 'qualification',
      key: 'qualification',
      filters: qualifications.map(qual => ({ text: qual, value: qual })),
      onFilter: (value, record) => record.qualification === value,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      filters: designations.map(desig => ({ text: desig, value: desig })),
      onFilter: (value, record) => record.designation === value,
    },
    {
      title: 'Father Name',
      dataIndex: 'fatherName',
      key: 'fatherName',
    },
    {
      title: 'Joining Date',
      dataIndex: 'startYear',
      key: 'startYear',
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Active' : 'Resigned'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Resigned', value: false },
      ],
      onFilter: (value, record) => record.status === value,
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
      title: 'Subjects',
      dataIndex: 'subjects',
      key: 'subjects',
      render: subjects => subjects?.join(', '),
    },
    {
      title: 'Research Areas',
      dataIndex: 'researchAreas',
      key: 'researchAreas',
      render: areas => areas?.join(', '),
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
            onClick={() => handleEditFaculty(record)}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDeleteFaculty(record)}
            disabled={!record.status}
          >
            {record.status ? 'Mark Resigned' : 'Resigned'}
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
        <h1 style={{ margin: 0 }}>Faculty List</h1>
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
            onClick={handleAddFaculty}
          >
            Add Faculty
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredFaculty}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} faculty members`,
        }}
      />
      <PopupWrapper />
    </div>
  );
};

export default AdminFacultyList;