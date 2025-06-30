import { useEffect, useState } from 'react';
import { Form, Button, Select, Space, Typography, Radio } from 'antd';
import axios from 'axios';
import config from '../../config';
import toast from 'react-hot-toast';

const { Option } = Select;
const { Text } = Typography;

const AdminEditCourseMapping = ({ mappingData, onUpdate, onClose, closePopup }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get(`${config.url}/admin/viewfaculties`);
        setFaculties(response.data || []);
      } catch (error) {
        console.error('Failed to fetch faculty list:', error);
        toast.error('Failed to load faculty list');
      }
    };

    fetchFaculties();

    if (mappingData) {
      const activeStatus = mappingData.status === true || mappingData.status === 'true';
      setIsActive(activeStatus);

      form.setFieldsValue({
        ...mappingData,
        status: activeStatus,
        facultyId: mappingData.facultyId,
      });
    }
  }, [mappingData, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const updatedMapping = {
        ...mappingData,
        ...values,
        status: values.status,
        facultyId: values.facultyId
      };

      const response = await axios.put(`${config.url}/admin/updateFCMapping`, updatedMapping);

      if (response.status === 200) {
        toast.success('Mapping updated successfully!');
        onUpdate(updatedMapping);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        onClose();
        closePopup();
      } else {
        toast.error('Failed to update mapping');
      }
    } catch (error) {
      const errorText = error.response?.data?.message || 'Update failed due to server error';
      toast.error(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <h2>Editing Mapping: {mappingData?.cname}</h2>

      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item label="Mapping ID">
          <Text strong>{mappingData?.fmapid}</Text>
        </Form.Item>

        <Form.Item label="Course ID">
          <Text strong>{mappingData?.ccode}</Text>
        </Form.Item>

        <Form.Item label="Faculty">
          <Form.Item name="facultyId" rules={[{ required: true, message: 'Select a faculty' }]} noStyle>
            <Select placeholder="Select faculty" size="large">
              {faculties.map((fac) => (
                <Option key={fac.id} value={fac.id}>
                  {fac.id} - {fac.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Radio.Group value={isActive} disabled={isActive}>
            <Radio value={true}>Active</Radio>
            <Radio value={false}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
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
