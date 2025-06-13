import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Tag, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import usePopup from '../../components/usePopup';
import AdminAddCourseMapping from './AdminAddCourseMapping';
import AdminEditCourseMapping from './AdminEditCourseMappping';
import config from '../../config';
import axios from 'axios';

const departments = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'ChE', 'AE'];

const AdminCourseMapping = () => {
  const [mappings, setMappings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const { showPopup, closePopup, PopupWrapper } = usePopup();

  const fetchFacultyDetails = async (facultyId) => {
    try {
      const response = await axios.get(`${config.url}/admin/viewFacultyById/${facultyId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch faculty ${facultyId}`, error);
      return {
        name: 'Unknown Faculty',
        department: 'Unknown',
        error: true
      };
    }
  };

  const fetchCourseDetails = async (ccode) => {
    try {
      const response = await axios.get(`${config.url}/admin/viewCourseById/${ccode}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch course ${ccode}`, error);
      return {
        cname: 'Unknown Course',
        cshortName: 'Unknown',
        credits: 0,
        error: true
      };
    }
  };

  useEffect(() => {
    const fetchMappings = async () => {
      setLoading(true);
      setErrorCount(0);
      
      try {
        const response = await axios.get(`${config.url}/admin/viewFCMapping`);
        const baseMappings = response.data;

        const enrichedMappings = await Promise.all(
          baseMappings.map(async (map) => {
            try {
              const [facultyData, courseData] = await Promise.all([
                fetchFacultyDetails(map.facultyId),
                fetchCourseDetails(map.ccode)
              ]);

              if (facultyData.error || courseData.error) {
                setErrorCount(prev => prev + 1);
              }

              return {
                ...map,
                facultyId: facultyData.id || map.facultyId,
                ccode: courseData.ccode || map.ccode,
                name: facultyData.name,
                department: facultyData.department,
                cname: courseData.cname,
                cshortname: courseData.cshortname,
                credits: courseData.credits,
                hasError: facultyData.error || courseData.error
              };
            } catch (innerErr) {
              console.error(`Failed to process mapping ${map.fmapid}`, innerErr);
              setErrorCount(prev => prev + 1);
              return {
                ...map,
                name: 'Error loading',
                department: 'Error',
                cname: 'Error loading',
                cshortname: 'Error',
                credits: 0,
                hasError: true
              };
            }
          })
        );
        
        setMappings(enrichedMappings);
        
        if (errorCount > 0) {
          message.warning(`Loaded with ${errorCount} mapping(s) having incomplete data`);
        }
      } catch (error) {
        message.error('Failed to load mappings');
        console.error('Error fetching mappings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMappings();
  }, []);

  const handleAddMapping = () => {
    showPopup(
      <AdminAddCourseMapping 
        departments={departments}
        onSuccess={(newMapping) => {
          setMappings([...mappings, newMapping]);
          message.success('Mapping added successfully!');
        }}
        closePopup={closePopup}
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
            m.fmapid === updatedMapping.fmapid ? updatedMapping : m
          ));
          message.success('Mapping updated successfully!');
        }}
        onClose={closePopup}
      />
    );
  };

  const handleDeleteMapping = async (record) => {
    const response = await axios.put(`${config.url}/admin/changeMappingStatus`,{
      fmapid: record.fmapid,
      status: !record.status 
    });
    if(response.status === 200) {
      setMappings(mappings.map(m => 
        m.fmapid === record.fmapid ? { ...m, status: !m.status } : m
      ));
      message.success(`Mapping ${record.status ? 'deactivated' : 'activated'} successfully!`);
    }else{
      message.error('Failed to change mapping status');
    }
  };

  const filteredMappings = mappings.filter(mapping => {
    if (!mapping) return false;
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase();
    return (
      (mapping.cname || '').toLowerCase().includes(searchLower) ||
      (mapping.name || '').toLowerCase().includes(searchLower) ||
      (mapping.ccode || '').toLowerCase().includes(searchLower) ||
      (mapping.facultyId || '').toLowerCase().includes(searchLower) ||
      (mapping.department || '').toLowerCase().includes(searchLower) ||
      (mapping.fmapid || '').toLowerCase().includes(searchLower) ||
      (mapping.component || '').toLowerCase().includes(searchLower) ||
      (mapping.cshortname || '').toLowerCase().includes(searchLower)
    );
  });

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
      dataIndex: 'fmapid',
      key: 'fmapid',
      align: 'center',
    },
    {
      title: 'Course ID',
      dataIndex: 'ccode',
      key: 'ccode',
      align: 'center',
    },
    {
      title: 'Course Name',
      dataIndex: 'cname',
      key: 'cname',
      align: 'center',
    },
    {
      title: 'Short Name',
      dataIndex: 'cshortname',
      key: 'cshortname',
      align: 'center',
    },
    {
      title: 'Faculty ID',
      dataIndex: 'facultyId',
      key: 'facultyId',
      align: 'center',
    },
    {
      title: 'Faculty Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      align: 'center',
    },
    {
      title: 'Component',
      dataIndex: 'component',
      key: 'component',
      align: 'center',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      align: 'center',
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
        rowKey="fmapid"
        loading={loading}
        scroll={{ x: 'max-content' }}
        bordered
        pagination={{
          // pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} mappings`,
        }}
      />
      <PopupWrapper />
    </div>
  );
};

export default AdminCourseMapping;
