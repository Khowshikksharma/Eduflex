import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Radio, Space, message, Typography, InputNumber } from 'antd';
import { MailOutlined, PhoneOutlined, IdcardOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const AdminEditFaculty = ({ 
  facultyData, 
  onUpdate, 
  onClose,
  departments,
  qualifications,
  maritalStatuses
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (facultyData) {
      const activeStatus = facultyData.status === true || facultyData.status === 'true';
      setIsActive(activeStatus);
      
      const formattedData = {
        ...facultyData,
        dob: facultyData.dob ? dayjs(facultyData.dob) : null,
        startYear: facultyData.startYear ? dayjs(facultyData.startYear, 'YYYY') : null,
        resignedDate: facultyData.resignedDate ? dayjs(facultyData.resignedDate) : null,
        status: activeStatus
      };
      form.setFieldsValue(formattedData);
    }
  }, [facultyData, form]);

  const onFinish = (values) => {
    setLoading(true);
    
    const updatedFaculty = {
      ...facultyData,
      ...values,
      dob: facultyData.dob, // Keep original DOB as it's not editable
      aadhaarNo: facultyData.aadhaarNo, // Keep original Aadhaar as it's not editable
      startYear: facultyData.startYear, // Keep original start year as it's not editable
      motherTongue: facultyData.motherTongue, // Keep original as it's not editable
      nationality: facultyData.nationality, // Keep original as it's not editable
      status: values.status,
      age: facultyData.age, // Keep original age as it's not editable
      resignedDate: values.resignedDate ? values.resignedDate.format('YYYY-MM-DD') : facultyData.resignedDate
    };

    setTimeout(() => {
      onUpdate(updatedFaculty);
      message.success('Faculty updated successfully!');
      setLoading(false);
      onClose();
    }, 1000);
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

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ 
        marginBottom: 24, 
        color: '#333',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        Editing Faculty: {facultyData?.name}
      </h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* ID (Not Editable) */}
        <Form.Item label="Faculty ID">
          <Text strong>{facultyData?.id || '-'}</Text>
        </Form.Item>

        {/* Name (Editable) */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please input faculty name!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Faculty Name" size="large" />
        </Form.Item>

        {/* Department (Editable) */}
        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: 'Please select department!' }]}
        >
          <Select placeholder="Select department" size="large">
            {departments?.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Age (Not Editable) */}
        <Form.Item label="Age">
          <Text strong>{facultyData?.age || '-'}</Text>
        </Form.Item>

        {/* DOB (Not Editable) */}
        <Form.Item label="Date of Birth">
          <Text strong>{formatDate(facultyData?.dob)}</Text>
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
          <Text strong>{facultyData?.aadhaarNo || '-'}</Text>
        </Form.Item>

        {/* Salary (Editable) */}
        <Form.Item
          label="Salary (₹)"
          name="salary"
          rules={[{ required: true, message: 'Please input salary!' }]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            min={0}
            step={1000}
            precision={0}
            size="large"
            formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/₹\s?|(,*)/g, '')}
          />
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
          <Text strong>{facultyData?.startYear || '-'}</Text>
        </Form.Item>

        {/* Status (Editable) */}
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
            <Radio value={false}>Resigned</Radio>
          </Radio.Group>
          {isActive && (
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Status can only be changed to Resigned via the Delete button
            </Text>
          )}
        </Form.Item>

        {/* Resigned Date (Editable) */}
        <Form.Item
          label="Resigned Date"
          name="resignedDate"
        >
          <DatePicker 
            style={{ width: '100%' }} 
            size="large"
            disabled={isActive}
          />
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
          <Text strong>{facultyData?.motherTongue || '-'}</Text>
        </Form.Item>

        {/* Nationality (Not Editable) */}
        <Form.Item label="Nationality">
          <Text strong>{facultyData?.nationality || '-'}</Text>
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
              Update Faculty
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

AdminEditFaculty.propTypes = {
  facultyData: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  departments: PropTypes.arrayOf(PropTypes.string).isRequired,
  qualifications: PropTypes.arrayOf(PropTypes.string).isRequired,
  maritalStatuses: PropTypes.arrayOf(PropTypes.string).isRequired
};

AdminEditFaculty.defaultProps = {
  departments: [],
  qualifications: [],
  maritalStatuses: []
};

export default AdminEditFaculty;