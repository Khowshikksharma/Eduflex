import React, { useState } from 'react';
import { Upload, Button, Form, Space, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';
import config from '../../config';
import { toast } from 'react-hot-toast';

const AdminAddCourseUpload = ({ closePopup, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [excelData, setExcelData] = useState(null);

  const beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      toast.error('You can only upload Excel files!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error('File must be smaller than 5MB!');
      return false;
    }
    return isExcel && isLt5M;
  };

  const calculateCredits = (l, t, p, s) => {
    const calculated = (l * 1.5) + (t * 0.5) + (p * 0.5) + (s * 0.5);
    return Math.max(1, Math.min(6, Math.round(calculated * 2) / 2));
  };

  const handleChange = async (info) => {
    let newFileList = [...info.fileList].slice(-1);
    setFileList(newFileList);

    const file = newFileList[0]?.originFileObj;
    if (file) {
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error('Excel file is empty or incorrectly formatted.');
          setExcelData(null);
          return;
        }

        const processedData = jsonData.map(course => {
          const l = course.L ? Number(course.L) : 0;
          const t = course.T ? Number(course.T) : 0;
          const p = course.P ? Number(course.P) : 0;
          const s = course.S ? Number(course.S) : 0;

          let departments = [];
          if (course.Departments) {
            departments = typeof course.Departments === 'string' 
              ? course.Departments.split(',').map(d => d.trim().toUpperCase()).filter(d => d)
              : Array.isArray(course.Departments) 
                ? course.Departments.map(d => d.toString().trim().toUpperCase()).filter(d => d)
                : [];
          }

          if (departments.length === 0) {
            toast.error(`Course ${course['Course Code']} has no departments specified`);
          }

          return {
            ccode: course['Course Code']?.toString().toUpperCase().trim(),
            cname: course['Course Name']?.toString().trim(),
            cshortname: course['Course Short Name']?.toString().trim(),
            academicYear: course['Academic Year']?.toString().trim(),
            semester: Number(course['Semester']) || 1,
            l: Math.max(0, Math.min(6, l)),
            t: Math.max(0, Math.min(6, t)),
            p: Math.max(0, Math.min(6, p)),
            s: Math.max(0, Math.min(6, s)),
            credits: course['Credits'] ? Number(course['Credits']) : calculateCredits(l, t, p, s),
            departments: departments,
            status: true
          };
        });

        setExcelData(processedData);
      } catch (error) {
        console.error(error);
        toast.error('Error parsing Excel file.');
      }
    }
  };

  const onFinish = async () => {
    if (!excelData || fileList.length === 0) {
      toast.error('Please upload a valid Excel file first!');
      return;
    }

    const invalidCourses = excelData.filter(course => !course.departments || course.departments.length === 0);
    if (invalidCourses.length > 0) {
      toast.error(`${invalidCourses.length} courses are missing departments`);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${config.url}/admin/uploadcourses`, excelData);

      if (response.data.success) {
        toast.success(`Successfully uploaded ${response.data.count} courses!`);
        setFileList([]);
        setExcelData(null);
        form.resetFields();
        closePopup();
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.data.message || 'Upload failed. Please check the file format.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to upload courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ marginBottom: 24, color: '#333', fontSize: '20px', fontWeight: '600' }}>
        Import Courses Spreadsheet
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Course Data File"
          name="file"
          rules={[{ required: true, message: 'Please upload an Excel file!' }]}
        >
          <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            accept=".xlsx,.xls"
            maxCount={1}
            customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
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
            <li>Required columns: 
              <Tag style={{ margin: '2px' }}>Course Code</Tag>
              <Tag style={{ margin: '2px' }}>Course Name</Tag>
              <Tag style={{ margin: '2px' }}>Course Short Name</Tag>
              <Tag style={{ margin: '2px' }}>Academic Year</Tag>
              <Tag style={{ margin: '2px' }}>Semester</Tag>
              <Tag style={{ margin: '2px' }}>L</Tag>
              <Tag style={{ margin: '2px' }}>T</Tag>
              <Tag style={{ margin: '2px' }}>P</Tag>
              <Tag style={{ margin: '2px' }}>S</Tag>
              <Tag style={{ margin: '2px' }}>Departments</Tag>
            </li>
            <li>Departments can be comma-separated (e.g., "CSE,IT")</li>
            <li>Credits column is optional (will be calculated if not provided)</li>
            <a
              href="/templates/Course_Template.xlsx"
              download
              style={{ color: '#1890ff', fontWeight: '500', marginTop: 8, display: 'inline-block' }}
            >
              Download Template
            </a>
          </ul>
        </div>

        {excelData && (
          <div style={{ marginBottom: 24 }}>
            <p>Preview (first 5 courses):</p>
            <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #d9d9d9', padding: '10px', borderRadius: '4px' }}>
              <pre>{JSON.stringify(excelData.slice(0, 5), null, 2)}</pre>
            </div>
          </div>
        )}

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              disabled={!excelData}
            >
              Import Courses
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

export default AdminAddCourseUpload;