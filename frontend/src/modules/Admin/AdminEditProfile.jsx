import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Table,
  message,
  Space,
  Typography
} from 'antd';
import { useNavigate } from 'react-router-dom';
import usePopup from '../../components/usePopup';
import AdminChangePassword from './AdminChangePassword';
import dayjs from 'dayjs';
import axios from 'axios';
import config from '../../config';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const qualifications = [
  '10th Grade',
  '12th Grade',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree'
];

const maritalStatuses = ['Single', 'Married', 'Divorced'];
const genders = ['Male', 'Female', 'Other'];

const AdminEditProfile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { showPopup, closePopup, PopupWrapper } = usePopup();
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      const storedData = sessionStorage.getItem('admin');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAdminData(parsedData);
      } else {
        message.warning('No admin data found in local storage.');
      }
    } catch {
      message.error('Failed to load admin data from local storage.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (adminData) {
      form.setFieldsValue({
        ...adminData,
        dob: adminData.dob ? dayjs(adminData.dob) : null
      });
    }
  }, [adminData, form]);

  const calculateAge = (dob) => {
    if (!dob) return '';
    return dayjs().diff(dayjs(dob), 'year');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formattedValues = {
        ...values,
        adminid: adminData?.id,
        dob: values.dob
          ? dayjs(values.dob).format('YYYY-MM-DD')
          : adminData?.dob || null
      };

      const response = await axios.put(`${config.url}/admin/updateprofile`, formattedValues);

      if (response.status === 200) {
        const updatedData = { ...adminData, ...formattedValues };
        sessionStorage.setItem('admin', JSON.stringify(updatedData));
        setAdminData(updatedData);
        message.success('Profile updated successfully!');
        window.location.reload();
      } else {
        message.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      message.error('An error occurred while updating the profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
    if (adminData) {
      form.setFieldsValue({
        ...adminData,
        dob: adminData.dob ? dayjs(adminData.dob) : null
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/home/dashboard');
  };

  const handlePasswordChange = () => {
    showPopup(
      <AdminChangePassword
        onSuccess={(success) => {
          if (success) {
            // Close popup immediately after getting status 200
            closePopup();
          }
        }}
        onCancel={() => {
          closePopup();
        }}
        adminData={adminData}
      />
    );
  };

  const formFields = [
    {
      key: 'id',
      label: 'Admin ID',
      value: adminData?.id || 'Loading...',
      editable: false
    },
    {
      key: 'name',
      label: 'Name',
      editable: true,
      component: <Input placeholder="Enter name" />,
      rules: [{ required: true, message: 'Please input your name!' }]
    },
    {
      key: 'age',
      label: 'Age',
      value: adminData?.dob ? calculateAge(adminData.dob) : '',
      editable: false
    },
    {
      key: 'dob',
      label: 'Date of Birth',
      value: adminData?.dob || '',
      editable: false
    },
    {
      key: 'gender',
      label: 'Gender',
      editable: true,
      component: (
        <Select placeholder="Select gender">
          {genders.map(gender => (
            <Option key={gender} value={gender}>{gender}</Option>
          ))}
        </Select>
      ),
      rules: [{ required: true, message: 'Please select gender!' }]
    },
    {
      key: 'email',
      label: 'Email',
      editable: true,
      component: <Input type="email" placeholder="Enter email" />,
      rules: [
        { required: true, message: 'Please input your email!' },
        { type: 'email', message: 'Please enter a valid email!' }
      ]
    },
    {
      key: 'phone',
      label: 'Phone Number',
      editable: true,
      component: <Input type="tel" placeholder="Enter phone number" maxLength={10} />,
      rules: [
        { required: true, message: 'Please input your phone number!' },
        { pattern: /^[6-9]\d{9}$/, message: 'Please enter valid Indian number!' }
      ]
    },
    {
      key: 'qualification',
      label: 'Qualification',
      editable: true,
      component: (
        <Select placeholder="Select qualification">
          {qualifications.map(qual => (
            <Option key={qual} value={qual}>{qual}</Option>
          ))}
        </Select>
      ),
      rules: [{ required: true, message: 'Please select qualification!' }]
    },
    {
      key: 'fatherName',
      label: 'Father Name',
      editable: true,
      component: <Input placeholder="Enter father's name" />,
      rules: [{ required: true, message: 'Please input father\'s name!' }]
    },
    {
      key: 'maritalStatus',
      label: 'Marital Status',
      editable: true,
      component: (
        <Select placeholder="Select marital status">
          {maritalStatuses.map(status => (
            <Option key={status} value={status}>{status}</Option>
          ))}
        </Select>
      ),
      rules: [{ required: true, message: 'Please select status!' }]
    },
    {
      key: 'motherTongue',
      label: 'Mother Tongue',
      editable: true,
      component: <Input placeholder="Enter mother tongue" />,
      rules: [{ required: true, message: 'Please input mother tongue!' }]
    },
    {
      key: 'nationality',
      label: 'Nationality',
      editable: true,
      component: <Input placeholder="Enter nationality" />,
      rules: [{ required: true, message: 'Please input nationality!' }]
    },
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <Title level={3} style={{ margin: 0 }}>Edit Your Profile</Title>
        <Button
          type="primary"
          onClick={handlePasswordChange}
          style={{ width: '160px' }}
        >
          Change Password
        </Button>
      </div>

      <Form form={form} layout="vertical">
        <Table
          dataSource={formFields}
          columns={[
            {
              title: 'Field',
              dataIndex: 'label',
              key: 'label',
              width: 200,
              render: (text) => <strong>{text}</strong>
            },
            {
              title: 'Value',
              key: 'value',
              render: (record) => (
                record.editable ? (
                  <Form.Item
                    name={record.key}
                    rules={record.rules}
                    style={{ marginBottom: 0 }}
                  >
                    {record.component}
                  </Form.Item>
                ) : (
                  <span>{record.value}</span>
                )
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
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClear}>Reset</Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
          >
            Save Changes
          </Button>
        </Space>
      </Form>

      <PopupWrapper />
    </div>
  );
};

export default AdminEditProfile;