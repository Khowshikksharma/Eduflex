import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    
    if (!showOTP) {
      // In a real app, you would send the email to your backend
      setTimeout(() => {
        toast.success(`OTP sent to ${values.email}`);
        setShowOTP(true);
        setLoading(false);
      }, 1000);
    } else {
      // Verify OTP - in real app, this would be checked against backend
      setTimeout(() => {
        toast.success('OTP verified successfully!');
        navigate('/new-password', { state: { email: values.email } });
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Forgot Password</h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Enter your registered email" 
            size="large" 
            disabled={showOTP}
          />
        </Form.Item>

        {showOTP && (
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Please input the OTP!' },
              { pattern: /^\d{6}$/, message: 'OTP must be 6 digits' }
            ]}
          >
            <Input 
              placeholder="Enter 6-digit OTP" 
              size="large" 
              maxLength={6}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            block
          >
            {showOTP ? 'Verify OTP' : 'Send OTP'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;