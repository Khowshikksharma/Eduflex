import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Space, Tag } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config'; 
import { toast } from 'react-hot-toast';

const { Option } = Select;

const AdminAddCourse = ({ onSuccess, departments, closePopup }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const [formValues, setFormValues] = useState({
    l: 0,
    t: 0,
    p: 0,
    s: 0,
    departments: []
  });

  useEffect(() => {
    const { l = 0, t = 0, p = 0, s = 0 } = formValues;
    const calculated = (l * 1.5) + (t * 0.5) + (p * 0.5) + (s * 0.5);
    const rounded = Math.max(1, Math.min(6, Math.round(calculated * 2) / 2));
    setCredits(rounded);
    form.setFieldsValue({ credits: rounded });
  }, [formValues, form]);

  const handleValuesChange = (changedValues) => {
    setFormValues(prev => ({
      ...prev,
      ...changedValues
    }));
  };

  const onFinish = async (values) => {
    setLoading(true);

    const newCourse = {
      ccode: values.courseCode,
      cname: values.courseName,
      cshortname: values.courseShortName,
      academicYear: values.academicYear,
      semester: values.semester,
      credits: credits,
      l: values.l || 0,
      t: values.t || 0,
      p: values.p || 0,
      s: values.s || 0,
      departments: values.departments || [],
      status: true,
    };

    try {
      await axios.post(`${config.url}/admin/insertCourse`, newCourse);
      toast.success('Course added successfully!');
      onSuccess(newCourse);
      form.resetFields();
      closePopup();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add course. Please try again.');
    } finally {
      setLoading(false);
    }
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
        onValuesChange={handleValuesChange}
        initialValues={{
          l: 0,
          t: 0,
          p: 0,
          s: 0,
          departments: []
        }}
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

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <Form.Item
            label="Lecture (L)"
            name="l"
            rules={[{ type: 'number', min: 0, max: 6, message: 'Must be between 0-6' }]}
          >
            <InputNumber min={0} max={6} size="large" />
          </Form.Item>

          <Form.Item
            label="Tutorial (T)"
            name="t"
            rules={[{ type: 'number', min: 0, max: 6, message: 'Must be between 0-6' }]}
          >
            <InputNumber min={0} max={6} size="large" />
          </Form.Item>

          <Form.Item
            label="Practical (P)"
            name="p"
            rules={[{ type: 'number', min: 0, max: 6, message: 'Must be between 0-6' }]}
          >
            <InputNumber min={0} max={6} size="large" />
          </Form.Item>

          <Form.Item
            label="Self Study (S)"
            name="s"
            rules={[{ type: 'number', min: 0, max: 6, message: 'Must be between 0-6' }]}
          >
            <InputNumber min={0} max={6} size="large" />
          </Form.Item>
        </div>

        <Form.Item
          label="Calculated Credits"
          name="credits"
        >
          <InputNumber
            style={{ width: '100%' }}
            value={credits}
            disabled
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Departments"
          name="departments"
          rules={[{ required: true, message: 'Please select at least one department!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select departments"
            size="large"
            tagRender={({ label, closable, onClose }) => (
              <Tag
                closable={closable}
                onClose={onClose}
                style={{ marginRight: 3 }}
              >
                {label}
              </Tag>
            )}
          >
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