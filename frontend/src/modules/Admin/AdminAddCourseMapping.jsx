import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Space } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminAddCourseMapping = ({ onSuccess, departments }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  // Mock data - in real app, these would come from API
  const courses = [
    { id: 'CS101', name: 'Introduction to Programming', shortName: 'Intro Prog', credits: 4, component: 'Core', department: 'CSE' },
    { id: 'CS102', name: 'Data Structures', shortName: 'DS', credits: 4, component: 'Core', department: 'CSE' },
  ];

  const faculties = [
    { id: 'FAC001', name: 'Dr. Smith', department: 'CSE' },
    { id: 'FAC002', name: 'Dr. Johnson', department: 'CSE' },
  ];

  const onFinish = (values) => {
    setLoading(true);
    
    const newMapping = {
      ...values,
      mappingId: `MAP${Math.floor(1000 + Math.random() * 9000)}`,
      status: true
    };

    setTimeout(() => {
      onSuccess(newMapping);
      message.success('Mapping added successfully!');
      setLoading(false);
      form.resetFields();
    }, 1000);
  };

  const filteredCourses = courses.filter(course => 
    selectedDept ? course.department === selectedDept : true
  );

  const filteredFaculties = faculties.filter(faculty => 
    selectedDept ? faculty.department === selectedDept : true
  );

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ marginBottom: 24, color: '#333', fontSize: '20px', fontWeight: '600' }}>
        Adding New Course-Faculty Mapping
      </h2>
      
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
            onChange={(value) => setSelectedDept(value)}
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Course"
          name="courseId"
          rules={[{ required: true, message: 'Please select course!' }]}
        >
          <Select 
            placeholder="Select course" 
            size="large"
            disabled={!selectedDept}
          >
            {filteredCourses.map(course => (
              <Option key={course.id} value={course.id}>
                {course.name} ({course.id})
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
            <Button type="primary" htmlType="submit" loading={loading} size="large" icon={<LinkOutlined />}>
              Create Mapping
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()} size="large">
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminAddCourseMapping;