import { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import usePopup from '../../components/usePopup';
import AdminAddStudent from './AdminAddStudent';
import AdminStudentViewPopup from './AdminStudentViewPopup';
import AdminEditStudent from './AdminEditStudent';
import axios from 'axios';
import config from '../../config';
import AdminAddStudentUpload from './AdminAddStudentUpload';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

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
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const { showPopup, closePopup, PopupWrapper } = usePopup();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.url}/admin/viewstudents`);
      const studentsData = response.data || [];
      if (Array.isArray(studentsData)) {
        setStudents(studentsData);
      } else {
        console.warn('API response is not an array:', studentsData);
        setStudents([]);
      }
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    showPopup(
      <AdminAddStudent 
        departments={departments}
        semesterFees={semesterFees}
        qualifications={qualifications}
        maritalStatuses={maritalStatuses}
        onSuccess={(newStudent) => {
          setStudents(prev => [...prev, newStudent]);
          // toast.success('Student added successfully!');
          closePopup();
        }}
        closePopup={closePopup}
      />
    );
  };

  const handleImportStudents = () => {
    showPopup(
      <AdminAddStudentUpload
        onSuccess={(newStudents) => {
          setStudents(prev => [...prev, ...newStudents]);
          toast.success('Students imported successfully!');
          closePopup();
        }}
        closePopup={closePopup}
      />
    );
  };

  const handleExportStudents = () => {
    const exportData = students.map(student => ({
      'ID': student.id,
      'Name': student.name,
      'Department': student.department,
      'Age': student.age,
      'Date of Birth': student.dob,
      'Gender': student.gender,
      'Email': student.email,
      'Phone No.': student.phone,
      'Aadhaar No.': student.aadhaarNo,
      'Semester Fee': `₹${(student.semesterFee || 0).toLocaleString('en-IN')}`,
      'Qualification': student.qualification,
      'Father Name': student.fatherName,
      'Start Year': student.startYear,
      'End Year': student.endYear,
      'Status': student.status ? 'Active' : 'Inactive',
      'Current Year': `${student.currentYear}${student.currentYear === '1' ? 'st' : student.currentYear === '2' ? 'nd' : student.currentYear === '3' ? 'rd' : 'th'} Year`,
      'Current Semester': `Semester ${student.currentSemester}`,
      'Marital Status': student.maritalStatus,
      'Mother Tongue': student.motherTongue,
      'Nationality': student.nationality,
      'Address': student.address
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'Students_Export.xlsx');
    toast.success('Students exported successfully!');
  };

  const handleViewStudent = (record) => {
  showPopup(
    <AdminStudentViewPopup 
      studentData={record}
      onEdit={(studentData) => {
        closePopup(); // Close the view popup first
        handleEditStudent(studentData); // Then open the edit popup
      }}
      onClose={closePopup}
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
          setStudents(prev => prev.map(s => 
            s.id === updatedStudent.id ? updatedStudent : s
          ));
          // toast.success('Student updated successfully!');
          closePopup();
        }}
        onClose={closePopup}
      />
    );
  };

  const handleDeleteStudent = async (record) => {
    try {
      const response = await axios.put(`${config.url}/admin/changeStudentStatus`, {
        id: record.id,
        status: false 
      });
      if (response.status === 200) {
        setStudents(prev => prev.map(s => 
          s.id === record.id ? { ...s, status: !s.status } : s
        ));
        toast.success(`Student ${record.status ? 'deactivated' : 'activated'} successfully!`);
      }
    } catch (error) {
      toast.error('Failed to change student status');
      console.error('Error changing student status:', error);
    }
  };

  const filteredStudents = students.filter(student => {
    if (!student) return false;
    return (
      (student.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.id?.toString().toLowerCase().includes(searchText.toLowerCase()))
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
    // {
    //   title: 'Age',
    //   dataIndex: 'age',
    //   key: 'age',
    //   sorter: (a, b) => (a.age || 0) - (b.age || 0),
    // },
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
    // {
    //   title: 'Aadhaar No.',
    //   dataIndex: 'aadhaarNo',
    //   key: 'aadhaarNo',
    // },
    // {
    //   title: 'Semester Fee',
    //   dataIndex: 'semesterFee',
    //   key: 'semesterFee',
    //   render: fee => `₹${(fee || 0).toLocaleString('en-IN')}`,
    //   sorter: (a, b) => (a.semesterFee || 0) - (b.semesterFee || 0),
    // },
    // {
    //   title: 'Qualification',
    //   dataIndex: 'qualification',
    //   key: 'qualification',
    //   filters: qualifications.map(qual => ({ text: qual, value: qual })),
    //   onFilter: (value, record) => record.qualification === value,
    // },
    // {
    //   title: 'Father Name',
    //   dataIndex: 'fatherName',
    //   key: 'fatherName',
    // },
    {
      title: 'Start Year',
      dataIndex: 'startYear',
      key: 'startYear',
      sorter: (a, b) => (a.startYear || 0) - (b.startYear || 0),
    },
    // {
    //   title: 'End Year',
    //   dataIndex: 'endYear',
    //   key: 'endYear',
    //   sorter: (a, b) => (a.endYear || 0) - (b.endYear || 0),
    // },
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
    // {
    //   title: 'Marital Status',
    //   dataIndex: 'maritalStatus',
    //   key: 'maritalStatus',
    //   filters: maritalStatuses.map(status => ({ text: status, value: status })),
    //   onFilter: (value, record) => record.maritalStatus === value,
    // },
    // {
    //   title: 'Mother Tongue',
    //   dataIndex: 'motherTongue',
    //   key: 'motherTongue',
    // },
    // {
    //   title: 'Nationality',
    //   dataIndex: 'nationality',
    //   key: 'nationality',
    // },
    // {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   key: 'address',
    //   ellipsis: true,
    // },
    {
      title: 'Action → View/Edit/Delete',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle" style={{ zIndex: 0 }}>
          <Button 
            type="link" 
            onClick={() => handleViewStudent(record)}
          >
            View
          </Button>
          <Button 
            type="link" 
            onClick={() => handleEditStudent(record)}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            disabled={!record.status}
            onClick={() => handleDeleteStudent(record)}
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
          <Button 
            type="primary" 
            icon={<UploadOutlined />}
            onClick={handleImportStudents}
          >
            Import Student Data
          </Button>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={handleExportStudents}
          >
            Export Students Data
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

export default AdminStudentList;