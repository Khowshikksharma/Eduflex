import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Space, message, Typography, Radio } from 'antd';

const { Option } = Select;
const { Text } = Typography;
//departments is erased in blow line after onClose
const AdminEditCourseMapping = ({ mappingData, onUpdate, onClose}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (mappingData) {
      const activeStatus = mappingData.status === true || mappingData.status === 'true';
      setIsActive(activeStatus);
      
      form.setFieldsValue({
        ...mappingData,
        status: activeStatus
      });
    }
  }, [mappingData, form]);

  const onFinish = (values) => {
    setLoading(true);
    
    const updatedMapping = {
      ...mappingData,
      ...values,
      status: values.status
    };

    setTimeout(() => {
      onUpdate(updatedMapping);
      message.success('Mapping updated successfully!');
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleStatusChange = (e) => {
    setIsActive(e.target.value);
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ 
        marginBottom: 24, 
        color: '#333',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        Editing Mapping: {mappingData?.courseName} → {mappingData?.facultyName}
      </h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="Mapping ID">
          <Text strong>{mappingData?.mappingId}</Text>
        </Form.Item>

        <Form.Item label="Course ID">
          <Text strong>{mappingData?.courseId}</Text>
        </Form.Item>

        <Form.Item label="Course Name">
          <Text strong>{mappingData?.courseName}</Text>
        </Form.Item>

        <Form.Item label="Course Short Name">
          <Text strong>{mappingData?.courseShortName}</Text>
        </Form.Item>

        <Form.Item label="Faculty ID">
          <Text strong>{mappingData?.facultyId}</Text>
        </Form.Item>

        <Form.Item
          label="Faculty Name"
          name="facultyName"
          rules={[{ required: true, message: 'Please input faculty name!' }]}
        >
          <Input placeholder="Faculty Name" size="large" />
        </Form.Item>

        <Form.Item label="Credits">
          <Text strong>{mappingData?.credits}</Text>
        </Form.Item>

        <Form.Item label="Component">
          <Text strong>{mappingData?.component}</Text>
        </Form.Item>

        <Form.Item label="Department">
          <Text strong>{mappingData?.department}</Text>
        </Form.Item>

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
            <Radio value={false}>Inactive</Radio>
          </Radio.Group>
          {isActive && (
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Status can only be changed to Inactive via the Delete button
            </Text>
          )}
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Update Mapping
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

export default AdminEditCourseMapping;