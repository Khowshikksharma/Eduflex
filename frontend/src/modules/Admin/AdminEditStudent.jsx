import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Radio, Space, Typography, InputNumber } from 'antd';
import { MailOutlined, PhoneOutlined, IdcardOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from '../../config';
import toast from 'react-hot-toast';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const AdminEditStudent = ({ studentData, onUpdate, onClose, qualifications, maritalStatuses }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (studentData) {
      const activeStatus = studentData.status === true || studentData.status === 'true';
      setIsActive(activeStatus);
      
      const formattedData = {
        ...studentData,
        dob: studentData.dob ? dayjs(studentData.dob) : null,
        status: activeStatus
      };
      form.setFieldsValue(formattedData);
    }
  }, [studentData, form]);

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      const updatedStudent = {
        ...studentData,
        ...values,
        dob: studentData?.dob, 
        aadhaarNo: studentData?.aadhaarNo,
        semesterFee: studentData?.semesterFee,
        startYear: studentData?.startYear,
        motherTongue: studentData?.motherTongue,
        nationality: studentData?.nationality,
        department: studentData?.department,
        status: values.status,
        age: studentData?.age
      };

      const response = await axios.put(`${config.url}/admin/updatestudent`, updatedStudent);
      if (response.status === 200) {
        toast.success('Student updated successfully!');
        onUpdate(updatedStudent); // Pass the updated student data back
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error('Failed to update student. Please try again.');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setIsActive(e.target.value);
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

  const formatDate = (dateString) => {
    return dateString ? dayjs(dateString).format('DD-MM-YYYY') : '-';
  };

  if (!studentData) {
    return <div>Loading student data...</div>;
  }

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ 
        marginBottom: 24, 
        color: '#333',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        Editing Student: {studentData?.name || 'Unknown'}
      </h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* ID (Not Editable) */}
        <Form.Item label="Student ID">
          <Text strong>{studentData?.id || '-'}</Text>
        </Form.Item>

        {/* Name (Editable) */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please input student name!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Student Name" size="large" />
        </Form.Item>

        {/* Department (Not Editable) */}
        <Form.Item label="Department">
          <Text strong>{studentData?.department || '-'}</Text>
        </Form.Item>

        {/* Age (Not Editable) */}
        <Form.Item label="Age">
          <Text strong>{studentData?.age || '-'}</Text>
        </Form.Item>

        {/* DOB (Not Editable) */}
        <Form.Item label="Date of Birth">
          <Text strong>{formatDate(studentData?.dob)}</Text>
        </Form.Item>

        {/* Gender (Editable) */}
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

        {/* Email (Editable) */}
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

        {/* Phone No (Editable) */}
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { validator: validatePhoneNumber }
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Phone Number" size="large" />
        </Form.Item>

        {/* Aadhaar No (Not Editable) */}
        <Form.Item label="Aadhaar Number">
          <Text strong>{studentData?.aadhaarNo || '-'}</Text>
        </Form.Item>

        {/* Semester Fee (Not Editable) */}
        <Form.Item label="Semester Fee">
          <Text strong>
            {studentData?.semesterFee ? 
              `₹${studentData.semesterFee.toLocaleString('en-IN')}` : 
              '-'}
          </Text>
        </Form.Item>

        {/* Qualification (Editable) */}
        <Form.Item
          label="Qualification"
          name="qualification"
          rules={[{ required: true, message: 'Please select qualification!' }]}
        >
          <Select placeholder="Select qualification" size="large">
            {qualifications?.map(qual => (
              <Option key={qual} value={qual}>{qual}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Father Name (Editable) */}
        <Form.Item
          label="Father's Name"
          name="fatherName"
          rules={[{ required: true, message: 'Please input father\'s name!' }]}
        >
          <Input placeholder="Father's Name" size="large" />
        </Form.Item>

        {/* Start Year (Not Editable) */}
        <Form.Item label="Start Year">
          <Text strong>{studentData?.startYear || '-'}</Text>
        </Form.Item>

        {/* End Year (Editable) */}
        <Form.Item
          label="End Year"
          name="endYear"
          rules={[{ required: true, message: 'Please select end year!' }]}
        >
          <Select placeholder="Select end year" size="large">
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Status (Editable) */}
        <Form.Item
          label="Status"
          name="status"
        >
          <div>
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
          </div>
        </Form.Item>

        {/* Current Year (Editable) */}
        <Form.Item
          label="Current Year"
          name="currentYear"
          rules={[{ required: true, message: 'Please input current year!' }]}
        >
          <Select placeholder="Select current year" size="large">
            <Option value="1">1st Year</Option>
            <Option value="2">2nd Year</Option>
            <Option value="3">3rd Year</Option>
            <Option value="4">4th Year</Option>
          </Select>
        </Form.Item>

        {/* Current Semester (Editable) */}
        <Form.Item
          label="Current Semester"
          name="currentSemester"
          rules={[{ required: true, message: 'Please input current semester!' }]}
        >
          <Select placeholder="Select current semester" size="large">
            <Option value="1">Semester 1</Option>
            <Option value="2">Semester 2</Option>
            <Option value="3">Semester 3</Option>
            <Option value="4">Semester 4</Option>
            <Option value="5">Semester 5</Option>
            <Option value="6">Semester 6</Option>
            <Option value="7">Semester 7</Option>
            <Option value="8">Semester 8</Option>
          </Select>
        </Form.Item>

        {/* Marital Status (Editable) */}
        <Form.Item
          label="Marital Status"
          name="maritalStatus"
          rules={[{ required: true, message: 'Please select marital status!' }]}
        >
          <Select placeholder="Select marital status" size="large">
            {maritalStatuses?.map(status => (
              <Option key={status} value={status}>{status}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Mother Tongue (Not Editable) */}
        <Form.Item label="Mother Tongue">
          <Text strong>{studentData?.motherTongue || '-'}</Text>
        </Form.Item>

        {/* Nationality (Not Editable) */}
        <Form.Item label="Nationality">
          <Text strong>{studentData?.nationality || '-'}</Text>
        </Form.Item>

        {/* Address (Editable) */}
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
              Update Student
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

AdminEditStudent.propTypes = {
  studentData: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  qualifications: PropTypes.arrayOf(PropTypes.string),
  maritalStatuses: PropTypes.arrayOf(PropTypes.string)
};

AdminEditStudent.defaultProps = {
  studentData: null,
  qualifications: [],
  maritalStatuses: []
};

export default AdminEditStudent;