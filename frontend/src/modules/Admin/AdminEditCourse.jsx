import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Space, message, Typography, InputNumber, Radio } from 'antd';

const { Option } = Select;
const { Text } = Typography;

const AdminEditCourse = ({ courseData, onUpdate, onClose, departments }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (courseData) {
      const activeStatus = courseData.status === true || courseData.status === 'true';
      setIsActive(activeStatus);
      
      form.setFieldsValue({
        ...courseData,
        status: activeStatus
      });
    }
  }, [courseData, form]);

  const onFinish = (values) => {
    setLoading(true);
    
    const updatedCourse = {
      ...courseData,
      ...values,
      status: values.status
    };

    setTimeout(() => {
      onUpdate(updatedCourse);
      message.success('Course updated successfully!');
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleStatusChange = (e) => {
    setIsActive(e.target.value);
  };

  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => 
      `${currentYear + i}-${currentYear + i + 1}`
    );
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ 
        marginBottom: 24, 
        color: '#333',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        Editing Course: {courseData?.courseName} ({courseData?.courseCode})
      </h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="Course Code">
          <Text strong>{courseData?.courseCode}</Text>
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

        <Form.Item
          label="Status"
          name="status"
        >
          <Radio.Group 
            onChange={handleStatusChange} 
            value={isActive}
            disabled={isActive}
          >
            <Radio value={true}>Active</Radio>
            <Radio value={false}>Inactive</Radio>
          </Radio.Group>
          {isActive && (
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Status can only be changed to Inactive via the Delete button
            </Text>
          )}
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Update Course
            </Button>
            <Button htmlType="button" onClick={onClose} size="large">
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminEditCourse;