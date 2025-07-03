import { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Tag, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import usePopup from '../../components/usePopup';
import AdminAddCourseMapping from './AdminAddCourseMapping';
import AdminEditCourseMapping from './AdminEditCourseMapping';
import config from '../../config';
import axios from 'axios';
import toast from 'react-hot-toast';

const departments = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'ChE', 'AE'];
const components = ['L', 'T', 'P', 'S'];

const AdminCourseMapping = () => {
  const [mappings, setMappings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const { showPopup, closePopup, PopupWrapper } = usePopup();


  const fetchMappings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.url}/admin/viewFCMapping`);
        setMappings(response.data);
      } catch (error) {
        toast.error('Failed to load mappings');
        console.error('Error fetching mappings:', error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  const handleAddMapping = () => {
    showPopup(
      <AdminAddCourseMapping
        departments={departments}
        onSuccess={(newMapping) => {
          setMappings(prev => [...prev, newMapping]);
          // toast.success('Mapping added successfully!');
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
          setMappings(prev => prev.map(m => 
            m.fmapid === updatedMapping.fmapid ? updatedMapping : m
          ));
          // toast.success('Mapping updated successfully!');
        }}
        onClose={closePopup}
      />
    );
  };

  const handleDeleteMapping = async (record) => {
    try {
      const response = await axios.put(`${config.url}/admin/changeMappingStatus`, {
        fmapid: record.fmapid,
        status: !record.status
      });
      
      if(response.status === 200) {
        setMappings(prev => prev.map(m => 
          m.fmapid === record.fmapid ? { ...m, status: !m.status } : m
        ));
        toast.success(`Mapping ${record.status ? 'deactivated' : 'activated'} successfully!`);
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error('Error changing mapping status:', error);
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
      (mapping.components?.join('') || '').toLowerCase().includes(searchLower) ||
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
      sorter: (a, b) => a.fmapid.localeCompare(b.fmapid),
    },
    {
      title: 'Course ID',
      dataIndex: 'ccode',
      key: 'ccode',
      align: 'center',
      sorter: (a, b) => a.ccode.localeCompare(b.ccode),
    },
    {
      title: 'Course Name',
      dataIndex: 'cname',
      key: 'cname',
      align: 'center',
    },
    {
      title: 'Academic Year',
      dataIndex: 'academicYear',
      key: 'academicYear',
      align: 'center',
      sorter: (a, b) => a.academicYear.localeCompare(b.academicYear),
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      align: 'center',
      sorter: (a, b) => a.semester - b.semester,
      render: semester => `Semester ${semester}`,
    },
    {
      title: 'Faculty ID',
      dataIndex: 'facultyId',
      key: 'facultyId',
      align: 'center',
    },
    {
      title: 'Faculty Name',
      dataIndex: 'facultyname',
      key: 'facultyname',
      align: 'center',
    },
    {
      title: 'Departments',
      dataIndex: 'departments',
      key: 'departments',
      align: 'center',
      render: depts => depts?.join(', ') || 'N/A',
      filters: departments.map(dept => ({ text: dept, value: dept })),
      onFilter: (value, record) => record.departments?.includes(value),
    },
    {
      title: 'Components (Hours)',
      dataIndex: 'components',
      key: 'components',
      align: 'center',
      render: (components) => {
        if (!components || components.length === 0) return 'N/A';
        const formattedComponents = ['L', 'T', 'P', 'S']
          .map(comp => {
            const found = components.find(c => c.type === comp);
            return found && found.hours > 0 ? `${comp}(${found.hours})` : null;
          })
          .filter(Boolean);
        return formattedComponents.length > 0
          ? formattedComponents.join('-')
          : 'None';
      },
      filters: components.map(comp => ({ text: comp, value: comp })),
      onFilter: (value, record) =>
        record.components?.some(c => c.type === value && c.hours > 0),
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
      title: 'Actions',
      key: 'actions',
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
            disabled={!record.status}
            onClick={() => handleDeleteMapping(record)}
          >
            {record.status ? 'Activate' : 'Inactive'}
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
            placeholder="Search by course, faculty, components etc."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
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
        style={{
          position: 'relative',
          zIndex: 0
        }}
        pagination={{
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