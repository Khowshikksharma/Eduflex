import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Tag, message } from 'antd';
import { SearchOutlined, PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import usePopup from '../../components/usePopup';
import AdminAddFaculty from './AdminAddFaculty';
import AdminEditFaculty from './AdminEditFaculty';
import AdminAddFacultyUpload from './AdminAddFacultyUpload';
import axios from 'axios';
import config from '../../config';
import * as XLSX from 'xlsx';

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
  const [courseMappings, setCourseMappings] = useState({});

  useEffect(() => {
    fetchFaculty();
    fetchCourseMappings();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.url}/admin/viewfaculties`);
      const facultyData = response.data || [];
      if (Array.isArray(facultyData)) {
        setFaculty(facultyData);
      } else {
        console.warn('API response is not an array:', facultyData);
        setFaculty([]);
      }
    } catch (error) {
      message.error('Failed to fetch faculty data');
      console.error('Error fetching faculty:', error);
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleAddFaculty = () => {
    showPopup(
      <AdminAddFaculty 
        departments={departments}
        qualifications={qualifications}
        maritalStatuses={maritalStatuses}
        designations={designations}
        
        onSuccess={(newFaculty) => {
          setFaculty(prev => [...prev, newFaculty]);
          message.success('Faculty added successfully!');
          closePopup();
        }}
        closePopup={closePopup}
      />
    );
  };
=======
const fetchCourseMappings = async () => {
  try {
    const mappingRes = await axios.get(`${config.url}/admin/viewFCMapping`);
    const mappings = mappingRes.data || [];
    const updatedMappings = {};
>>>>>>> 84de00cd8d8f397add5bc8dd6df9871c3a773c55

    for (let map of mappings) {
      try {
        const facultyRes = await axios.get(`${config.url}/admin/viewFacultyById/${map.facultyId}`);
        const facultyStringId = facultyRes.data.id;
        const courseNames = [];
        const courseCodes = Array.isArray(map.ccode) ? map.ccode : [map.ccode];

        for (let ccode of courseCodes) {
          try {
            const courseRes = await axios.get(`${config.url}/admin/viewCourseById/${ccode}`);
            if (courseRes.data?.cshortname) {
              courseNames.push(courseRes.data.cshortname);
              // console.log(courseRes.data.cshortname);
            }
          } catch (error) {
            console.warn(`Failed to fetch course ${ccode}:`, error);
          }
        }

        if (facultyStringId && courseNames.length) {
          if (!updatedMappings[facultyStringId]) {
            updatedMappings[facultyStringId] = [];
          }
          updatedMappings[facultyStringId].push(...courseNames);
        }
      } catch (error) {
        console.warn(`Failed to process mapping for faculty ${map.facultyId}:`, error);
      }
    }

    setCourseMappings(updatedMappings);
  } catch (error) {
    console.error('Failed to fetch FC Mappings:', error);
    message.error('Failed to load course mappings');
  }
};


const handleAddFaculty = () => {
  showPopup(
    <AdminAddFaculty 
      departments={departments}
      qualifications={qualifications}
      maritalStatuses={maritalStatuses}
      designations={designations}
      onSuccess={(newFaculty) => {
        setFaculty(prev => [...prev, newFaculty]);
        message.success('Faculty added successfully!');
        closePopup();
      }}
      closePopup={closePopup}
    />
  );
};

const handleImportFaculty = () => {
  showPopup(
    <AdminAddFacultyUpload
      onSuccess={(newFaculty) => {
        setFaculty(prev => [...prev, ...newFaculty]);
        message.success('Faculty imported successfully!');
        closePopup();
      }}
      closePopup={closePopup}
    />
  );
};

const handleExportFaculty = () => {
  const exportData = faculty.map(f => ({
    'ID': f.id,
    'Name': f.name,
    'Department': f.department,
    'Age': f.age,
    'Date of Birth': f.dob,
    'Gender': f.gender,
    'Email': f.email,
    'Phone No.': f.phone,
    'Aadhaar No.': f.aadhaarNo,
    'Salary': `₹${(f.salary || 0).toLocaleString('en-IN')}`,
    'Qualification': f.qualification,
    'Designation': f.designation,
    'Father Name': f.fatherName,
    'Joining Date': f.startYear,
    'Experience': f.experience,
    'Status': f.status ? 'Active' : 'Resigned',
    'Marital Status': f.maritalStatus,
    'Mother Tongue': f.motherTongue,
    'Nationality': f.nationality,
    'Subjects': f.subjects?.join(', '),
    'Address': f.address
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);
  XLSX.utils.book_append_sheet(wb, ws, 'Faculty');
  XLSX.writeFile(wb, 'Faculty_Export.xlsx');
  message.success('Faculty exported successfully!');
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
        setFaculty(prev => prev.map(f => 
          f.id === updatedFaculty.id ? updatedFaculty : f
        ));
        message.success('Faculty updated successfully!');
        closePopup();
      }}
      onClose={closePopup}
    />
  );
};

const handleDeleteFaculty = async (record) => {
  try {
    const response = await axios.put(`${config.url}/admin/changeFacultyStatus`, {
      id: record.id,
      status: !record.status
    });
    if (response.status === 200) {
      setFaculty(prev => prev.map(f => 
        f.id === record.id ? { ...f, status: !f.status } : f
      ));
      message.success(`Faculty ${record.status ? 'deactivated' : 'activated'} successfully!`);
    }
  } catch (error) {
    message.error('Failed to change faculty status');
    console.error('Error changing faculty status:', error);
  }
};

const filteredFaculty = faculty.filter(f => {
  if (!f) return false;
  return (
    (f.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    f.id?.toString().toLowerCase().includes(searchText.toLowerCase()))
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
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => (a.id || '').toString().localeCompare((b.id || '').toString()),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
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
    sorter: (a, b) => (a.age || 0) - (b.age || 0),
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
    render: salary => `₹${(salary || 0).toLocaleString('en-IN')}`,
    sorter: (a, b) => (a.salary || 0) - (b.salary || 0),
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
    // dataIndex: 'subjects',
    key: 'mappedCourses',
    render: (_, record) => {
      const courses = courseMappings[record.id] || [];
      return courses.length > 0 ? courses.join(', ') : '—'; 
    },
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
      <Space size="middle" style={{ zIndex: 0 }}> {/* Add zIndex here */}
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
        <Button 
          type="primary" 
          icon={<UploadOutlined />}
          onClick={handleImportFaculty}
        >
          Import Faculty Data
        </Button>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={handleExportFaculty}
        >
          Export Faculty Data
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
      style={{
        position: 'relative',
        zIndex: 0 // Ensure table content stays behind footers
      }}
      pagination={{
        pageSizeOptions: [10, 20, 50, 100],
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} students`,
      }}
    />
    <PopupWrapper />
  </div>
);
};

export default AdminFacultyList;