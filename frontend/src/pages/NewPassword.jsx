import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const NewPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Removed unused email state

  useEffect(() => {
    if (location.state?.email) {
      // Removed setEmail as email state is no longer used
      form.setFieldsValue({ email: location.state.email });
    } else {
      navigate('/forgot-password');
    }
  }, [location, form, navigate]);

  const onFinish = (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    
    // In a real app, you would send this to your backend
    setTimeout(() => {
      toast.success('Password changed successfully!');
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Set New Password</h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          label="Email"
        >
          <Input 
            prefix={<MailOutlined />} 
            size="large" 
            disabled
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please input your new password!' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="New Password" 
            size="large" 
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
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
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Confirm Password" 
            size="large" 
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            block
          >
            Save Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewPassword;