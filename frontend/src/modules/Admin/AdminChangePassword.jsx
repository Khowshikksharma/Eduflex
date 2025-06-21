import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import config from './../../config';
import axios from 'axios';

const AdminChangePassword = ({ onSuccess, onCancel, adminData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;
    
    if (newPassword !== confirmPassword) {
      message.error('New password and confirm password do not match.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.put(`${config.url}/admin/changepassword`, {
        adminId: adminData.id,
        oldPassword,
        newPassword
      });
      
      if (response.data.status === 200) {
        // Let parent handle popup closing
        if (onSuccess) {
          onSuccess(true); // Pass success flag
        }
      } else {
        message.error(response.data.message || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      message.error('An error occurred while changing the password.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Change Password</h2>
      
      <Form
        form={form}
        name="change_password"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="oldPassword"
          label="Old Password"
          rules={[{ required: true, message: 'Please input your old password!' }]}
        >
          <Input.Password placeholder="Enter old password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please input your new password!' }
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ marginRight: '8px' }}
          >
            Change Password
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminChangePassword;