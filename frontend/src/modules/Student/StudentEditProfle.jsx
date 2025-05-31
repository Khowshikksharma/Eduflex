import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Table, message, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import usePopup from '../../components/usePopup';
import StudentChangePassword from './StudentChangePassword';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const StudentEditProfile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { showPopup, PopupWrapper } = usePopup();
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStudentData({
        id: '25CSE00001',
        name: 'John Doe',
        department: 'CSE',
        dob: '2002-05-15',
        gender: 'Male',
        email: 'john.doe@example.com',
        phone: '9876543210',
        aadhaarNo: '123456789012',
        semesterFee: 130000,
        qualification: '12th Grade',
        fatherName: 'Robert Doe',
        startYear: 2025,
        endYear: 2029,
        status: 'Active',
        currentYear: '1',
        currentSem: '1',
        maritalStatus: 'Single',
        motherTongue: 'English',
        nationality: 'Indian',
        address: '123 Main Street, Bangalore'
      });
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (studentData) {
      form.setFieldsValue({
        ...studentData,
        dob: studentData.dob ? dayjs(studentData.dob) : null
      });
    }
  }, [studentData, form]);

  const calculateAge = (dob) => {
    if (!dob) return '';
    return dayjs().diff(dayjs(dob), 'year');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        setStudentData(values);
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
      <StudentChangePassword 
        onSuccess={() => message.success('Password changed successfully!')}
        onCancel={() => message.info('Password change cancelled')}
      />
    );
  };

  const formFields = [
    { key: 'id', label: 'Student ID', value: studentData?.id || 'Loading...', editable: false },
    { key: 'name', label: 'Name', value: studentData?.name || '', editable: false },
    { key: 'department', label: 'Department', value: studentData?.department || '', editable: false },
    { key: 'age', label: 'Age', value: studentData?.dob ? calculateAge(studentData.dob) : '', editable: false },
    { key: 'dob', label: 'Date of Birth', value: studentData?.dob || '', editable: false },
    { key: 'gender', label: 'Gender', value: studentData?.gender || '', editable: false },
    { key: 'email', label: 'Email', value: studentData?.email || '', editable: false },
    { key: 'phone', label: 'Phone No.', value: studentData?.phone || '', editable: false },
    { key: 'aadhaarNo', label: 'Aadhaar No.', value: studentData?.aadhaarNo || '', editable: false },
    { key: 'semesterFee', label: 'Semester Fee', value: studentData?.semesterFee ? `₹${studentData.semesterFee.toLocaleString()}` : '', editable: false },
    { key: 'qualification', label: 'Qualification', value: studentData?.qualification || '', editable: false },
    { key: 'fatherName', label: 'Father Name', value: studentData?.fatherName || '', editable: false },
    { key: 'startYear', label: 'Start Year', value: studentData?.startYear || '', editable: false },
    { key: 'endYear', label: 'End Year', value: studentData?.endYear || '', editable: false },
    { key: 'status', label: 'Status', value: studentData?.status || '', editable: false },
    { key: 'currentYear', label: 'Current Year', value: studentData?.currentYear || '', editable: false },
    { key: 'currentSem', label: 'Current Sem', value: studentData?.currentSem || '', editable: false },
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
    { key: 'motherTongue', label: 'Mother Tongue', value: studentData?.motherTongue || '', editable: false },
    { key: 'nationality', label: 'Nationality', value: studentData?.nationality || '', editable: false },
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
        <Title level={3} style={{ margin: 0 }}>Edit Student Profile</Title>
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
          <Button onClick={() => navigate('/student/home/dashboard')}>Cancel</Button>
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

export default StudentEditProfile;