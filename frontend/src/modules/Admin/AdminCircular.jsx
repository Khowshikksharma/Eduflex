import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Table, 
  Modal, 
  Form, 
  Input, 
  Upload, 
  message, 
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
  SolutionOutlined
} from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

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
  const [recipientGroups, setRecipientGroups] = useState(['students', 'faculty', 'staff']);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchCirculars();
    fetchDepartments();
  }, []);

  const fetchCirculars = async () => {
    try {
      const response = await axios.get(`${config.url}/admin/all-circulars`);
      setCirculars(response.data);
    } catch (error) {
      message.error('Failed to fetch circulars');
      console.error('Error fetching circulars:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${config.url}/departments`);
      setDepartments(response.data);
    } catch (error) {
      message.error('Failed to fetch departments');
      console.error('Error fetching departments:', error);
    }
  };

  const handleSendCircular = async (values) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('subject', values.subject);
    formData.append('description', values.description);
    formData.append('recipientGroups', JSON.stringify(recipientGroups));
    formData.append('selectedDepartments', JSON.stringify(selectedDepartments));
    
    fileList.forEach(file => {
      formData.append('attachments', file.originFileObj);
    });

    try {
      await axios.post(`${config.url}/admin/send-all-circular`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      message.success('Circular sent successfully to all recipients!');
      form.resetFields();
      setFileList([]);
      setIsModalVisible(false);
      fetchCirculars();
    } catch (error) {
      message.error('Failed to send circular');
      console.error('Error sending circular:', error);
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
    if (file.type.includes('image')) {
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
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text, record) => (
        <a onClick={() => setSelectedCircular(record)}>{text}</a>
      ),
    },
    {
      title: 'Recipients',
      dataIndex: 'recipientGroups',
      key: 'recipients',
      render: (groups) => (
        <Space>
          {groups.includes('students') && <Tag icon={<UserOutlined />}>Students</Tag>}
          {groups.includes('faculty') && <Tag icon={<SolutionOutlined />}>Faculty</Tag>}
          {groups.includes('staff') && <Tag icon={<TeamOutlined />}>Staff</Tag>}
        </Space>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => dayjs(date).format('DD MMM YYYY, hh:mm A'),
    },
    {
      title: 'Attachments',
      dataIndex: 'attachments',
      key: 'attachments',
      render: (attachments) => (
        attachments?.length > 0 ? (
          <Tag icon={<PaperClipOutlined />}>{attachments.length}</Tag>
        ) : null
      ),
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
    switch(extension) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'ppt':
      case 'pptx':
        return <FilePptOutlined style={{ color: '#faad14' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageOutlined style={{ color: '#722ed1' }} />;
      default:
        return <FileOutlined />;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Title level={3}>All Circulars</Title>
        <Button 
          type="primary" 
          icon={<SendOutlined />} 
          onClick={() => setIsModalVisible(true)}
        >
          Send New Circular
        </Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={circulars} 
          rowKey="_id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Circular Details Modal */}
      {selectedCircular && (
        <Modal
          title={selectedCircular.subject}
          visible={!!selectedCircular}
          onCancel={() => setSelectedCircular(null)}
          footer={null}
          width={800}
        >
          <div style={{ marginBottom: '16px' }}>
            <Space direction="vertical">
              <Text type="secondary">
                Sent on {dayjs(selectedCircular.createdAt).format('DD MMM YYYY, hh:mm A')}
              </Text>
              <div>
                <Text strong>Sent to: </Text>
                {selectedCircular.recipientGroups.includes('students') && <Tag icon={<UserOutlined />}>Students</Tag>}
                {selectedCircular.recipientGroups.includes('faculty') && <Tag icon={<SolutionOutlined />}>Faculty</Tag>}
                {selectedCircular.recipientGroups.includes('staff') && <Tag icon={<TeamOutlined />}>Staff</Tag>}
              </div>
              {selectedCircular.selectedDepartments?.length > 0 && (
                <div>
                  <Text strong>Departments: </Text>
                  {selectedCircular.selectedDepartments.map(dept => (
                    <Tag key={dept}>{dept}</Tag>
                  ))}
                </div>
              )}
            </Space>
          </div>

          <Divider />

          <div 
            dangerouslySetInnerHTML={{ __html: selectedCircular.description }} 
            style={{ marginBottom: '24px' }}
          />

          {selectedCircular.attachments?.length > 0 && (
            <>
              <Divider orientation="left">Attachments</Divider>
              <List
                dataSource={selectedCircular.attachments}
                renderItem={file => (
                  <List.Item>
                    <Space>
                      {fileTypeIcon(file.name)}
                      <a 
                        href={`${config.url}/uploads/${file.path}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {file.name}
                      </a>
                      <Text type="secondary">({(file.size / 1024).toFixed(1)} KB)</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </>
          )}
        </Modal>
      )}

      {/* Send Circular Modal */}
      <Modal
        title="Send Circular to All"
        visible={isModalVisible}
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
                { label: 'Staff', value: 'staff' },
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
                Supports multiple file uploads. Max file size: 10MB
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
        visible={previewVisible}
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