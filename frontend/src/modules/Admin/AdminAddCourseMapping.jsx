import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Select, Space } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import { toast } from 'react-hot-toast';


const { Option } = Select;

const AdminAddCourseMapping = ({ onSuccess, departments = [], closePopup }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  // const [errorMsg, setErrorMsg] = useState('');

  // Reset everything when component mounts (popup opens)
  useEffect(() => {
    form.resetFields();
    setSelectedDept(null);
    // setErrorMsg('');
  }, [form]);

  // Fetch courses and faculties
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, facultiesRes] = await Promise.all([
          axios.get(`${config.url}/admin/viewCourses`),
          axios.get(`${config.url}/admin/viewfaculties`)
        ]);
        setCourses(coursesRes.data);
        setFaculties(facultiesRes.data);
        // console.log(coursesRes.data, facultiesRes.data);
      } catch (err) {
        toast.error('Failed to load data');
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const newMapping = {
        ...values,
        fmapid: `MAP${Math.floor(1000 + Math.random() * 9000)}`,
        status: true
      };

      const res = await axios.post(`${config.url}/admin/addCourseMapping`, newMapping);

      if (res) {
        // setErrorMsg('');
        toast.success('Mapping created successfully!');
        onSuccess(newMapping);
        form.resetFields();
        closePopup(); 
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      console.error('Error creating mapping:', err);
      // setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = useCallback((value) => {
    setSelectedDept(value);
    form.setFieldsValue({
      ccode: undefined,
      facultyId: undefined
    });
  }, [form]);

  const filteredCourses = selectedDept
    ? courses.filter(course => course.department === selectedDept)
    : [];

  const filteredFaculties = selectedDept
    ? faculties.filter(faculty => faculty.department === selectedDept)
    : [];

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ marginBottom: 24, color: '#333', fontSize: '20px', fontWeight: '600' }}>
        Adding New Course-Faculty Mapping
      </h2>
      {/* {errorMsg && (
        <div style={{ color: 'red', marginBottom: '16px' }}>
          ⚠️ {errorMsg}
        </div>
      )} */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: 'Please select department!' }]}
        >
          <Select
            placeholder="Select department"
            size="large"
            allowClear
            onChange={handleDepartmentChange}
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Course"
          name="ccode"
          rules={[{ required: true, message: 'Please select course!' }]}
        >
          <Select
            placeholder="Select course"
            size="large"
            disabled={!selectedDept}
          >
            {filteredCourses.map(course => (
              <Option key={course.ccode} value={course.ccode}>
                {course.cname} ({course.ccode})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Faculty"
          name="facultyId"
          rules={[{ required: true, message: 'Please select faculty!' }]}
        >
          <Select
            placeholder="Select faculty"
            size="large"
            disabled={!selectedDept}
          >
            {filteredFaculties.map(faculty => (
              <Option key={faculty.id} value={faculty.id}>
                {faculty.name} ({faculty.id})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              icon={<LinkOutlined />}
            >
              Create Mapping
            </Button>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
                setSelectedDept(null);
                // setErrorMsg('');
              }}
              size="large"
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminAddCourseMapping;
