import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Upload,
  Card,
  Divider,
  List,
  Tag,
  Space,
  Typography,
  Select,
  Checkbox
} from 'antd';
import {
  InboxOutlined,
  PaperClipOutlined,
  SendOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileImageOutlined,
  FileOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const departments = [
  'CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'ChE', 'AE',
  'ASE', 'AUT', 'AGE', 'BIO', 'BME', 'CEE', 'CER'
];

const AdminCircular = () => {
  const [form] = Form.useForm();
  const [circulars, setCirculars] = useState([]);
  const [selectedCircular, setSelectedCircular] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [recipientGroups, setRecipientGroups] = useState(['students', 'faculty']);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const fileTypeToName = (extension) => {
    const types = {
      pdf: 'PDF Document',
      doc: 'Word Document',
      docx: 'Word Document',
      xls: 'Excel Spreadsheet',
      xlsx: 'Excel Spreadsheet',
      ppt: 'PowerPoint',
      pptx: 'PowerPoint',
      jpg: 'JPEG Image',
      jpeg: 'JPEG Image',
      png: 'PNG Image',
      gif: 'GIF Image',
      csv: 'Common-Separated Values'
    };
    return types[extension.toLowerCase()] || 'File';
  };

  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      const response = await axios.get(`${config.url}/admin/all-circulars`);
      setCirculars(response.data);
    } catch (error) {
      toast.error('Failed to fetch circulars');
      console.error('Error fetching circulars:', error);
    }
  };

  const handleSendCircular = async (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('subject', values.subject);
    formData.append('description', values.description);
    formData.append('recipientGroups', JSON.stringify(recipientGroups));
    formData.append('selectedDepartments', JSON.stringify(selectedDepartments));

    fileList.forEach((file) => {
      formData.append('attachments', file.originFileObj);
    });

    try {
      await axios.post(`${config.url}/admin/send-all-circular`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Circular sent successfully to all recipients!');
      form.resetFields();
      setFileList([]);
      setIsModalVisible(false);
      fetchCirculars();
    } catch (error) {
      console.error('Detailed error:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Server Error');
      } else if (error.request) {
        toast.error('No response from server. Check your network.');
      } else {
        toast.error('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemoveFile = (file) => {
    const newFileList = fileList.filter(f => f.uid !== file.uid);
    setFileList(newFileList);
  };

  const handlePreview = async (file) => {
    if (file.type && file.type.includes('image')) {
      setPreviewImage(file.url || file.thumbUrl);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
      setPreviewVisible(true);
    } else {
      window.open(file.url || file.thumbUrl, '_blank');
    }
  };

  const handleRecipientChange = (checkedValues) => {
    setRecipientGroups(checkedValues);
  };

  const columns = [
    {
      title: 'S.No',
      render: (text, record, index) => index + 1,
      width: 70,
      align: 'center',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      render: (text, record) => (
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }} title={text}>
          <a onClick={() => setSelectedCircular(record)}>{text}</a>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Recipients',
      dataIndex: 'recipientGroups',
      render: (groups) => (
        <Space>
          {groups.includes('students') && <Tag icon={<UserOutlined />}>Students</Tag>}
          {groups.includes('faculty') && <Tag icon={<SolutionOutlined />}>Faculty</Tag>}
        </Space>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (date) => dayjs(date).format('DD MMM YYYY, hh:mm A'),
    },
    {
      title: 'Attachments',
      dataIndex: 'attachments',
      render: (attachments) => attachments?.length > 0 ? (
        <Tag icon={<PaperClipOutlined />}>{attachments.length}</Tag>
      ) : null,
    },
    {
      title: 'View',
      render: (text, record) => (
        <Button type="link" onClick={() => setSelectedCircular(record)}>View</Button>
      ),
      align: 'center',
    },
  ];

  const uploadProps = {
    onRemove: handleRemoveFile,
    beforeUpload: () => false,
    onChange: handleFileChange,
    multiple: true,
    fileList,
    onPreview: handlePreview,
  };

  const fileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'doc':
      case 'docx': return <FileWordOutlined style={{ color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx': return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'ppt':
      case 'pptx': return <FilePptOutlined style={{ color: '#faad14' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FileImageOutlined style={{ color: '#722ed1' }} />;
      case 'csv': return <FileImageOutlined style={{ color: '#faad14' }} />;
      default: return <FileOutlined />;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Title level={3}>All Circulars</Title>
        <Button type="primary" icon={<SendOutlined />} onClick={() => setIsModalVisible(true)}>
          Send New Circular
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={circulars}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Circular Details Modal */}
      <div>
        {selectedCircular && (
          <Modal
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SolutionOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
                <span style={{ fontSize: '18px', fontWeight: '500' }}>Circular Details</span>
              </div>
            }
            open={!!selectedCircular}
            onCancel={() => setSelectedCircular(null)}
            footer={null}
            width={800}
            centered
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
              <Title level={4} style={{ marginBottom: '8px' }}>
                {selectedCircular.subject}
              </Title>
              
              <Space size="middle" style={{ marginBottom: '12px' }}>
                {selectedCircular.recipientGroups.includes('students') && (
                  <Tag icon={<UserOutlined />} color="blue">Students</Tag>
                )}
                {selectedCircular.recipientGroups.includes('faculty') && (
                  <Tag icon={<SolutionOutlined />} color="purple">Faculty</Tag>
                )}
                <Text type="secondary">
                  <ClockCircleOutlined style={{ marginRight: '4px' }} />
                  {dayjs(selectedCircular.createdAt).format('DD MMM YYYY, hh:mm A')}
                </Text>
              </Space>
              
              {selectedCircular.selectedDepartments?.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <Text strong style={{ marginRight: '8px' }}>Departments:</Text>
                  {selectedCircular.selectedDepartments.map(dept => (
                    <Tag key={dept} color="cyan">{dept}</Tag>
                  ))}
                </div>
              )}
            </div>

            <Card 
              bordered={false} 
              bodyStyle={{ 
                padding: '16px',
                backgroundColor: '#fafafa',
                borderRadius: '4px'
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: selectedCircular.description }} 
                style={{ 
                  lineHeight: '1.6',
                  fontSize: '15px'
                }}
              />
            </Card>

            {selectedCircular.attachments?.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>
                  <PaperClipOutlined style={{ marginRight: '8px' }} />
                  Attachments ({selectedCircular.attachments.length})
                </Title>
                <List
                  dataSource={selectedCircular.attachments}
                  renderItem={file => (
                    <List.Item 
                      style={{ 
                        padding: '12px 16px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '4px',
                        marginBottom: '8px',
                        backgroundColor: '#fff'
                      }}
                    >
                      <List.Item.Meta
                        avatar={fileTypeIcon(file.name)}
                        title={
                          <a 
                            href={`${config.uploadsUrl}/${file.path}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            {file.name}
                          </a>
                        }
                        description={
                          <Text type="secondary">
                            {fileTypeToName(file.name.split('.').pop())} • {(file.size / 1024).toFixed(1)} KB
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <Button 
                type="primary" 
                onClick={() => setSelectedCircular(null)}
                style={{ minWidth: '100px' }}
              >
                Close
              </Button>
            </div>
          </Modal>
        )}
      </div>
      
      {/* Send Circular Modal */}
      <Modal
        title="Send Circular to All"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendCircular}
        >
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please enter subject!' }]}
          >
            <Input placeholder="Subject" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description!' }]}
          >
            <TextArea rows={6} placeholder="Type your message here..." />
          </Form.Item>

          <Form.Item label="Recipient Groups" required>
            <Checkbox.Group
              options={[
                { label: 'Students', value: 'students' },
                { label: 'Faculty', value: 'faculty' },
              ]}
              value={recipientGroups}
              onChange={handleRecipientChange}
            />
          </Form.Item>

          {recipientGroups.includes('students') && (
            <Form.Item label="Select Departments (Optional)">
              <Select
                mode="multiple"
                placeholder="Select departments (leave empty for all)"
                value={selectedDepartments}
                onChange={setSelectedDepartments}
                style={{ width: '100%' }}
              >
                {departments.map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item label="Attachments">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint">
                Supported file types: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX,CSV<br />
                Max file size: 10MB • Max files: 10
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              icon={<SendOutlined />}
            >
              Send to All
            </Button>
            <Button 
              style={{ marginLeft: '8px' }} 
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setFileList([]);
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AdminCircular;