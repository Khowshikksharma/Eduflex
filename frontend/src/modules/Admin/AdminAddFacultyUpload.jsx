import React, { useState } from 'react';
import { Upload, Button, message, Form, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';

const AdminAddFacultyUpload = ({ closePopup, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                   file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      message.error('You can only upload Excel files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File must smaller than 5MB!');
    }
    return isExcel && isLt5M;
  };

  const handleChange = (info) => {
    let newFileList = [...info.fileList];
    
    // Limit to 1 file
    newFileList = newFileList.slice(-1);
    
    // Update file status
    newFileList = newFileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  const onFinish = async () => {
    if (fileList.length === 0) {
      message.error('Please upload an Excel file first!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj);

    try {
      const response = await axios.post(`${config.url}/admin/uploadfaculty`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        message.success(`Successfully uploaded ${response.data.count} faculty members!`);
        if (onSuccess && response.data.newFaculty) {
          onSuccess(response.data.newFaculty);
        }
        closePopup();
      } else {
        message.error(response.data.message || 'Upload failed. Please check the file format.');
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to upload faculty. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ marginBottom: 24, color: '#333', fontSize: '20px', fontWeight: '600' }}>
        Import Faculty Spreadsheet
      </h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Faculty Data File"
          name="file"
          rules={[{ required: true, message: 'Please upload an Excel file!' }]}
        >
          <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            accept=".xlsx,.xls"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} size="large">
              Select Excel File
            </Button>
          </Upload>
        </Form.Item>

        <div style={{ marginBottom: 24, color: '#666', fontSize: 14 }}>
          <p>File requirements:</p>
          <ul>
            <li>Excel format (.xlsx or .xls)</li>
            <li>Maximum file size: 5MB</li>
            <li>Follow the template format</li>
          </ul>
        </div>

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              size="large"
              disabled={fileList.length === 0}
            >
              Import Faculty
            </Button>
            <Button 
              htmlType="button" 
              onClick={() => {
                setFileList([]);
                form.resetFields();
              }} 
              size="large"
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminAddFacultyUpload;