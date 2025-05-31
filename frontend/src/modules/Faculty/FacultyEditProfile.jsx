import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Table, message, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import usePopup from '../../components/usePopup';
import FacultyChangePassword from './FacultyChangePassword';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const FacultyEditProfile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { showPopup, PopupWrapper } = usePopup();
  const [loading, setLoading] = useState(false);
  const [facultyData, setFacultyData] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFacultyData({
        id: 'FAC001',
        name: 'Dr. Smith',
        department: 'CSE',
        dob: '1980-05-15',
        gender: 'Male',
        email: 'smith@eduflex.com',
        phone: '9876543210',
        aadhaarNo: '123456789012',
        salary: 75000,
        qualification: 'PhD',
        fatherName: 'John Smith',
        startYear: 2015,
        status: 'Active',
        resignedDate: null,
        maritalStatus: 'Married',
        motherTongue: 'English',
        nationality: 'Indian',
        address: '456 Faculty Ave, Bangalore'
      });
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (facultyData) {
      form.setFieldsValue({
        ...facultyData,
        dob: facultyData.dob ? dayjs(facultyData.dob) : null,
        resignedDate: facultyData.resignedDate ? dayjs(facultyData.resignedDate) : null
      });
    }
  }, [facultyData, form]);

  const calculateAge = (dob) => {
    if (!dob) return '';
    return dayjs().diff(dayjs(dob), 'year');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        setFacultyData(values);
        message.success('Profile updated successfully!');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    showPopup(
      <FacultyChangePassword 
        onSuccess={() => message.success('Password changed successfully!')}
        onCancel={() => message.info('Password change cancelled')}
      />
    );
  };

  const formFields = [
    { key: 'id', label: 'Faculty ID', value: facultyData?.id || 'Loading...', editable: false },
    { key: 'name', label: 'Name', value: facultyData?.name || '', editable: false },
    { key: 'department', label: 'Department', value: facultyData?.department || '', editable: false },
    { key: 'age', label: 'Age', value: facultyData?.dob ? calculateAge(facultyData.dob) : '', editable: false },
    { key: 'dob', label: 'Date of Birth', value: facultyData?.dob || '', editable: false },
    { key: 'gender', label: 'Gender', value: facultyData?.gender || '', editable: false },
    { key: 'email', label: 'Email', value: facultyData?.email || '', editable: false },
    { key: 'phone', label: 'Phone No.', value: facultyData?.phone || '', editable: false },
    { key: 'aadhaarNo', label: 'Aadhaar No.', value: facultyData?.aadhaarNo || '', editable: false },
    { key: 'salary', label: 'Salary', value: facultyData?.salary ? `₹${facultyData.salary.toLocaleString()}` : '', editable: false },
    { 
      key: 'qualification', 
      label: 'Qualification', 
      editable: true,
      component: (
        <Select placeholder="Select qualification">
          <Option value="Bachelor's Degree">Bachelor's Degree</Option>
          <Option value="Master's Degree">Master's Degree</Option>
          <Option value="PhD">PhD</Option>
        </Select>
      ),
      rules: [{ required: true, message: 'Please select qualification!' }]
    },
    { key: 'fatherName', label: 'Father Name', value: facultyData?.fatherName || '', editable: false },
    { key: 'startYear', label: 'Start Year', value: facultyData?.startYear || '', editable: false },
    { key: 'status', label: 'Status', value: facultyData?.status || '', editable: false },
    { key: 'resignedDate', label: 'Resigned Date', value: facultyData?.resignedDate || '-', editable: false },
    { 
      key: 'maritalStatus', 
      label: 'Marital Status', 
      editable: true,
      component: (
        <Select placeholder="Select marital status">
          <Option value="Single">Single</Option>
          <Option value="Married">Married</Option>
          <Option value="Divorced">Divorced</Option>
        </Select>
      ),
      rules: [{ required: true, message: 'Please select marital status!' }]
    },
    { key: 'motherTongue', label: 'Mother Tongue', value: facultyData?.motherTongue || '', editable: false },
    { key: 'nationality', label: 'Nationality', value: facultyData?.nationality || '', editable: false },
    { 
      key: 'address', 
      label: 'Address', 
      editable: true,
      component: <TextArea rows={3} placeholder="Enter address" />,
      rules: [{ required: true, message: 'Please input address!' }]
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>Edit Faculty Profile</Title>
        <Button type="primary" onClick={handlePasswordChange} style={{ width: '160px' }}>
          Change Password
        </Button>
      </div>

      <Form form={form} layout="vertical">
        <Table
          dataSource={formFields}
          columns={[
            { title: 'Field', dataIndex: 'label', key: 'label', width: 200, render: (text) => <strong>{text}</strong> },
            { 
              title: 'Value', 
              key: 'value', 
              render: (record) => (
                record.editable ? (
                  <Form.Item name={record.key} rules={record.rules} style={{ marginBottom: 0 }}>
                    {record.component}
                  </Form.Item>
                ) : <span>{record.value}</span>
              )
            }
          ]}
          rowKey="key"
          loading={loading}
          pagination={false}
          bordered
          style={{ marginBottom: '24px' }}
        />

        <Space style={{ float: 'right' }}>
          <Button onClick={() => navigate('/faculty/home/dashboard')}>Cancel</Button>
          <Button onClick={() => form.resetFields()}>Reset</Button>
          <Button type="primary" onClick={handleSave} loading={loading}>
            Save Changes
          </Button>
        </Space>
      </Form>

      <PopupWrapper />
    </div>
  );
};

export default FacultyEditProfile;