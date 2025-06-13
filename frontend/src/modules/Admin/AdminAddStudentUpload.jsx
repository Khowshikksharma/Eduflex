  import React, { useState } from 'react';
  import { Upload, Button, message, Form, Space } from 'antd';
  import { UploadOutlined } from '@ant-design/icons';
  import axios from 'axios';
  import * as XLSX from 'xlsx';
  import config from '../../config';

  const AdminAddStudentUpload = ({ closePopup }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [excelData, setExcelData] = useState(null);

    const beforeUpload = (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                      file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error('You can only upload Excel files!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File must be smaller than 5MB!');
      }
      return isExcel && isLt5M;
    };

    const handleChange = async (info) => {
      let newFileList = [...info.fileList].slice(-1); // Only keep the latest
      setFileList(newFileList);

      const file = newFileList[0]?.originFileObj;
      if (file) {
        try {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            message.error('Excel file is empty or incorrectly formatted.');
            setExcelData(null);
          } else {
            setExcelData(jsonData);
          }
        } catch (error) {
          console.error(error);
          message.error('Error parsing Excel file.');
        }
      }
    };

    const onFinish = async () => {
      if (!excelData || fileList.length === 0) {
        message.error('Please upload a valid Excel file first!');
        return;
      }

      setLoading(true);

      try {
        const response = await axios.post(`${config.url}/admin/uploadstudents`, excelData);

        if (response.data.success) {
          message.success(`Successfully uploaded ${response.data.count} students!`);
          setFileList([]);
          setExcelData(null);
          form.resetFields();
          closePopup();
          window.location.reload(); 
        } else {
          message.error(response.data.message || 'Upload failed. Please check the file format.');
        }
      } catch (error) {
        console.error(error);
        message.error('Failed to upload students. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ marginBottom: 24, color: '#333', fontSize: '20px', fontWeight: '600' }}>
          Import Students Spreadsheet
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Student Data File"
            name="file"
            rules={[{ required: true, message: 'Please upload an Excel file!' }]}
          >
            <Upload
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              accept=".xlsx,.xls"
              maxCount={1}
              customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)} // prevent auto-upload
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
              <a
              href="/templates/Student_Template.xlsx"
              download
              style={{ color: '#1890ff', fontWeight: '500', marginTop: 8, display: 'inline-block' }}
              >
                Download Template
              </a>
            </ul>
          </div>

          <Form.Item style={{ marginTop: 32 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                disabled={!excelData}
              >
                Import Students
              </Button>
              <Button
                htmlType="button"
                onClick={() => {
                  setFileList([]);
                  setExcelData(null);
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

  export default AdminAddStudentUpload;
