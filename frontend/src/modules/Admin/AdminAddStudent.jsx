import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Radio, Space, InputNumber, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const generateStudentId = (department, startYear) => {
  const currentYearLastTwoDigits = String(startYear).slice(-2);
  const deptCode = department.length === 2 ? `0${department}` : department;
  const randomNumber = Math.floor(Math.random() * 50000) + 1;
  const serialNumber = String(randomNumber).padStart(5, '0');
  return `${currentYearLastTwoDigits}${deptCode}${serialNumber}`;
};

const AdminAddStudent = ({ 
  onSuccess, 
  departments, 
  semesterFees, 
  qualifications,
  maritalStatuses 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    
    const age = values.dob ? dayjs().diff(dayjs(values.dob), 'year') : null;
    const studentId = generateStudentId(values.department, values.startYear);

    const newStudent = {
      id: studentId,
      ...values,
      dob: values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : null,
      status: true,
      currentYear: '1',
      currentSemester: '1',
      age,
    };

    setTimeout(() => {
      onSuccess(newStudent);
      message.success('Student added successfully!');
      setLoading(false);
      form.resetFields();
    }, 1000);
  };

  const validatePhoneNumber = (_, value) => {
    if (!value) {
      return Promise.reject('Please input phone number!');
    }
    if (!/^[6-9]\d{9}$/.test(value)) {
      return Promise.reject('Please enter valid 10-digit number starting with 6,7,8 or 9!');
    }
    return Promise.resolve();
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ marginBottom: 24, color: '#333', fontSize: '20px', fontWeight: '600' }}>
        Adding New Student
      </h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please input student name!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Student Name" size="large" />
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
          label="Date of Birth"
          name="dob"
          rules={[{ required: true, message: 'Please select date of birth!' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            size="large"
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please select gender!' }]}
        >
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="Other">Other</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { validator: validatePhoneNumber }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="Phone Number" 
            maxLength={10} 
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Aadhaar Number"
          name="aadhaarNo"
          rules={[
            { required: true, message: 'Please input Aadhaar number!' },
            { pattern: /^\d{12}$/, message: 'Please enter valid 12-digit Aadhaar number' }
          ]}
        >
          <Input 
            prefix={<IdcardOutlined />} 
            placeholder="Aadhaar Number" 
            maxLength={12} 
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Semester Fee"
          name="semesterFee"
          rules={[{ required: true, message: 'Please select semester fee!' }]}
        >
          <Select placeholder="Select semester fee" size="large">
            {semesterFees.map(fee => (
              <Option key={fee.value} value={fee.value}>{fee.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Qualification"
          name="qualification"
          rules={[{ required: true, message: 'Please select qualification!' }]}
        >
          <Select placeholder="Select qualification" size="large">
            {qualifications.map(qual => (
              <Option key={qual} value={qual}>{qual}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Father's Name"
          name="fatherName"
          rules={[{ required: true, message: 'Please input father\'s name!' }]}
        >
          <Input placeholder="Father's Name" size="large" />
        </Form.Item>

        <Form.Item
          label="Start Year"
          name="startYear"
          rules={[{ required: true, message: 'Please select start year!' }]}
        >
          <Select placeholder="Select start year" size="large">
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="End Year"
          name="endYear"
          rules={[{ required: true, message: 'Please select end year!' }]}
        >
          <Select placeholder="Select end year" size="large">
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i + 4).map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Marital Status"
          name="maritalStatus"
          rules={[{ required: true, message: 'Please select marital status!' }]}
        >
          <Select placeholder="Select marital status" size="large">
            {maritalStatuses.map(status => (
              <Option key={status} value={status}>{status}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Mother Tongue"
          name="motherTongue"
          rules={[{ required: true, message: 'Please input mother tongue!' }]}
        >
          <Input placeholder="Mother Tongue" size="large" />
        </Form.Item>

        <Form.Item
          label="Nationality"
          name="nationality"
          rules={[{ required: true, message: 'Please input nationality!' }]}
        >
          <Input placeholder="Nationality" size="large" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input address!' }]}
        >
          <TextArea rows={4} placeholder="Address" size="large" />
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Add Student
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

export default AdminAddStudent;