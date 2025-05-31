import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Tag, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import usePopup from '../../components/usePopup';
import AdminAddCourseMapping from './AdminAddCourseMapping';
import AdminEditCourseMapping from './AdminEditCourseMappping';

const departments = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'ChE', 'AE'];

const AdminCourseMapping = () => {
  const [mappings, setMappings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const { showPopup, closePopup, PopupWrapper } = usePopup();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMappings([
        {
          mappingId: 'MAP001',
          courseId: 'CS101',
          courseName: 'Introduction to Programming',
          courseShortName: 'Intro Prog',
          facultyId: 'FAC001',
          facultyName: 'Dr. Smith',
          credits: 4,
          component: 'Core',
          department: 'CSE',
          status: true
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddMapping = () => {
    showPopup(
      <AdminAddCourseMapping 
        departments={departments}
        onSuccess={(newMapping) => {
          setMappings([...mappings, newMapping]);
          message.success('Mapping added successfully!');
        }}
      />
    );
  };

  const handleEditMapping = (record) => {
    showPopup(
      <AdminEditCourseMapping 
        mappingData={record}
        departments={departments}
        onUpdate={(updatedMapping) => {
          setMappings(mappings.map(m => 
            m.mappingId === updatedMapping.mappingId ? updatedMapping : m
          ));
          message.success('Mapping updated successfully!');
        }}
        onClose={closePopup}
      />
    );
  };

  const handleDeleteMapping = (record) => {
    Modal.confirm({
      title: 'Confirm Status Change',
      content: `Are you sure you want to change this mapping's status to Inactive?`,
      okText: 'Yes, Make Inactive',
      cancelText: 'Cancel',
      onOk: () => {
        const updatedMappings = mappings.map(m => 
          m.mappingId === record.mappingId ? { ...m, status: false } : m
        );
        setMappings(updatedMappings);
        message.success('Mapping status changed to Inactive');
      }
    });
  };

  const filteredMappings = mappings.filter(mapping => 
    mapping.courseName.toLowerCase().includes(searchText.toLowerCase()) ||
    mapping.facultyName.toLowerCase().includes(searchText.toLowerCase())
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
      title: 'Mapping ID',
      dataIndex: 'mappingId',
      key: 'mappingId',
    },
    {
      title: 'Course ID',
      dataIndex: 'courseId',
      key: 'courseId',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Short Name',
      dataIndex: 'courseShortName',
      key: 'courseShortName',
    },
    {
      title: 'Faculty ID',
      dataIndex: 'facultyId',
      key: 'facultyId',
    },
    {
      title: 'Faculty Name',
      dataIndex: 'facultyName',
      key: 'facultyName',
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
    },
    {
      title: 'Component',
      dataIndex: 'component',
      key: 'component',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: departments.map(dept => ({ text: dept, value: dept })),
      onFilter: (value, record) => record.department === value,
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
            onClick={() => handleEditMapping(record)}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDeleteMapping(record)}
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
        <h1 style={{ margin: 0 }}>Course - Faculty Mapping</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input
            placeholder="Search by course or faculty"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddMapping}
          >
            New Mapping
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredMappings}
        rowKey="mappingId"
        loading={loading}
        scroll={{ x: 'max-content' }}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} mappings`,
        }}
      />
      <PopupWrapper />
    </div>
  );
};

export default AdminCourseMapping;