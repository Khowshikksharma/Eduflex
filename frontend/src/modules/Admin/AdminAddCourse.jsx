import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, message, Space } from 'antd';
import { BookOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminAddCourse = ({ onSuccess, departments }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    
    const newCourse = {
      ...values,
      status: true,
    };

    setTimeout(() => {
      onSuccess(newCourse);
      message.success('Course added successfully!');
      setLoading(false);
      form.resetFields();
    }, 1000);
  };

  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => 
      `${currentYear + i}-${currentYear + i + 1}`
    );
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ marginBottom: 24, color: '#333', fontSize: '20px', fontWeight: '600' }}>
        Adding New Course
      </h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Course Code"
          name="courseCode"
          rules={[
            { required: true, message: 'Please input course code!' },
            { pattern: /^[A-Za-z0-9]{6}$/, message: 'Must be exactly 6 letters/numbers' }
          ]}
        >
          <Input 
            prefix={<BookOutlined />} 
            placeholder="e.g., CS101" 
            size="large" 
            maxLength={6}
          />
        </Form.Item>
        
        <Form.Item
          label="Course Name"
          name="courseName"
          rules={[{ required: true, message: 'Please input course name!' }]}
        >
          <Input placeholder="Course Name" size="large" />
        </Form.Item>

        <Form.Item
          label="Course Short Name"
          name="courseShortName"
          rules={[
            { required: true, message: 'Please input course short name!' },
            { max: 20, message: 'Short name must be 20 characters or less' }
          ]}
        >
          <Input placeholder="Short name for display" size="large" maxLength={20} />
        </Form.Item>

        <Form.Item
          label="Academic Year"
          name="academicYear"
          rules={[{ required: true, message: 'Please select academic year!' }]}
        >
          <Select placeholder="Select academic year" size="large">
            {generateAcademicYears().map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Semester"
          name="semester"
          rules={[{ required: true, message: 'Please select semester!' }]}
        >
          <Select placeholder="Select semester" size="large">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <Option key={sem} value={sem.toString()}>Semester {sem}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Credits"
          name="credits"
          rules={[
            { required: true, message: 'Please input credits!' },
            { type: 'number', min: 1, max: 6, message: 'Credits must be between 1 and 6' }
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            min={1}
            max={6}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: 'Please select department!' }]}
        >
          <Select placeholder="Select department" size="large">
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Add Course
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

export default AdminAddCourse;