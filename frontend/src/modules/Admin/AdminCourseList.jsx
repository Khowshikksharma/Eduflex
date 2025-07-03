import { useState, useEffect } from 'react';
import { Button, Input, Space, Table, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import usePopup from '../../components/usePopup';
import AdminAddCourse from './AdminAddCourse';
import AdminEditCourse from './AdminEditCourse';
import AdminAddCourseUpload from './AdminAddCourseUpload';
import axios from 'axios';
import config from '../../config';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const departments = [
  'CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'ChE', 'AE', 'ASE', 'AUT', 'AGE', 'BIO', 'BME', 'CEE', 'CER'
];

const AdminCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const { showPopup, closePopup, PopupWrapper } = usePopup();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setLoading(true);
    axios.get(`${config.url}/admin/viewCourses`)
      .then((response) => {
        const coursesData = response.data;
        if (Array.isArray(coursesData)) {
          const mappedCourses = coursesData.map(c => ({
            key: c.ccode,
            courseCode: c.ccode,
            courseName: c.cname,
            courseShortName: c.cshortname,
            academicYear: c.academicYear,
            semester: c.semester,
            credits: c.credits,
            l: c.l || 0,
            t: c.t || 0,
            p: c.p || 0,
            s: c.s || 0,
            departments: c.departments || [],
            status: c.status
          }));
          setCourses(mappedCourses);
        } else {
          setCourses([]);
          console.warn('API response is not an array:', coursesData);
        }
      })
      .catch((error) => {
        toast.error('Failed to fetch courses');
        console.error('Error fetching courses:', error);
        setCourses([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddCourse = () => {
    showPopup(
      <AdminAddCourse
        departments={departments}
        onSuccess={(newCourse) => {
          const mapped = {
            key: newCourse.ccode,
            courseCode: newCourse.ccode,
            courseName: newCourse.cname,
            courseShortName: newCourse.cshortname,
            academicYear: newCourse.academicYear,
            semester: newCourse.semester,
            credits: newCourse.credits,
            l: newCourse.l || 0,
            t: newCourse.t || 0,
            p: newCourse.p || 0,
            s: newCourse.s || 0,
            departments: newCourse.departments || [],
            status: newCourse.status
          };
          setCourses([...courses, mapped]);
        }}
        closePopup={closePopup}
      />
    );
  };

  const handleImportCourses = () => {
    showPopup(
      <AdminAddCourseUpload
        onSuccess={fetchCourses}
        closePopup={closePopup}
      />
    );
  };

  const handleExportCourses = () => {
    const exportData = courses.map(course => ({
      'Course Code': course.courseCode,
      'Course Name': course.courseName,
      'Course Short Name': course.courseShortName,
      'Academic Year': course.academicYear,
      'Semester': course.semester,
      'L': course.l,
      'T': course.t,
      'P': course.p,
      'S': course.s,
      'Credits': course.credits,
      'Departments': course.departments.join(','),
      'Status': course.status ? 'Active' : 'Inactive'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    XLSX.utils.book_append_sheet(wb, ws, 'Courses');
    XLSX.writeFile(wb, 'Courses_Export.xlsx');
    
    toast.success('Courses exported successfully!');
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
          l: record.l,
          t: record.t,
          p: record.p,
          s: record.s,
          departments: record.departments,
          status: record.status
        }}
        departments={departments}
        onUpdate={(updatedCourse) => {
          const mapped = {
            key: updatedCourse.ccode,
            courseCode: updatedCourse.ccode,
            courseName: updatedCourse.cname,
            courseShortName: updatedCourse.cshortname,
            academicYear: updatedCourse.academicYear,
            semester: updatedCourse.semester,
            credits: updatedCourse.credits,
            l: updatedCourse.l,
            t: updatedCourse.t,
            p: updatedCourse.p,
            s: updatedCourse.s,
            departments: updatedCourse.departments,
            status: updatedCourse.status
          };
          setCourses(courses.map(c =>
            c.courseCode === mapped.courseCode ? mapped : c
          ));
        }}
        onClose={closePopup}
      />
    );
  };

  const handleDeleteCourse = async (record) => {
    try {
      const response = await axios.put(`${config.url}/admin/changeCourseStatus`, {
        ccode: record.courseCode,
        status: !record.status
      });
      if (response.status === 200) {
        setCourses(courses.map(c =>
          c.courseCode === record.courseCode ? { ...c, status: !c.status } : c
        ));
        toast.success('Course status updated successfully!');
      } else {
        toast.error('Failed to update course status');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update course status');
      console.error('Error updating course status:', error);
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
      title: 'L-T-P-S',
      key: 'ltps',
      render: (_, record) => `${record.l || 0}-${record.t || 0}-${record.p || 0}-${record.s || 0}`,
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
      title: 'Departments',
      dataIndex: 'departments',
      key: 'departments',
      render: (departments) => (
        <span>
          {departments?.map(dept => (
            <Tag key={dept} style={{ margin: '2px' }}>{dept}</Tag>
          ))}
        </span>
      ),
      filters: departments.map(dept => ({ text: dept, value: dept })),
      onFilter: (value, record) => record.departments?.includes(value),
      sorter: (a, b) => (a.departments?.join() || '').localeCompare(b.departments?.join() || ''),
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
        <Space size="middle" style={{ zIndex: 0 }}>
          <Button 
            type="link" 
            onClick={() => handleEditCourse(record)}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            disabled={!record.status}
            onClick={() => handleDeleteCourse(record)}
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
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleImportCourses}
          >
            Import Courses Data
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportCourses}
          >
            Export Courses Data
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCourses}
        rowKey="key"
        loading={loading}
        scroll={{ x: 'max-content' }}
        bordered
        style={{
          position: 'relative',
          zIndex: 0
        }}
        pagination={{
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} courses`,
        }}
      />
      <PopupWrapper />
    </div>
  );
};

export default AdminCourseList;