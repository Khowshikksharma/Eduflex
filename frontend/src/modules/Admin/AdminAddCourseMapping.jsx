import React, { useState, useEffect } from 'react';
import { Form, Button, Select, Space, Checkbox, Row, Col } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';
import toast from 'react-hot-toast';

const { Option } = Select;

const AdminAddCourseMapping = ({ onSuccess, departments = [], closePopup }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);

  useEffect(() => {
    form.resetFields();
    setSelectedDepts([]);
    setSelectedCourse(null);
    setSelectedComponents([]);
  }, [form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, facultiesRes] = await Promise.all([
          axios.get(`${config.url}/admin/viewCourses`),
          axios.get(`${config.url}/admin/viewfaculties`)
        ]);
        setCourses(coursesRes.data);
        setFaculties(facultiesRes.data);
      } catch (err) {
        toast.error('Failed to load data');
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleDepartmentChange = (values) => {
    setSelectedDepts(values);
    form.setFieldsValue({
      ccode: undefined,
      facultyId: undefined
    });
    setSelectedCourse(null);
    setSelectedComponents([]);
  };

  const handleCourseChange = (value) => {
    const course = courses.find(c => c.ccode === value);
    setSelectedCourse(course);
    setSelectedComponents([]);
  };

  const handleComponentToggle = (component, checked) => {
    setSelectedComponents(prev => 
      checked ? [...prev, component] : prev.filter(c => c !== component)
    );
  };

  const onFinish = async (values) => {
      setLoading(true);
      try {
        if (!selectedCourse) {
          toast.error('Please select a course');
          return;
        }

        if (selectedComponents.length === 0) {
          toast.error('Please select at least one component');
          return;
        }

        const faculty = faculties.find(f => f.id === values.facultyId);
        if (!faculty) {
          toast.error('Selected faculty not found');
          return;
        }

        const components = selectedComponents.map(component => ({
          type: component,
          hours: selectedCourse[component.toLowerCase()] || 0
        }));

        const newMapping = {
          facultyId: values.facultyId,
          facultyname: faculty.name,  // Added faculty name
          ccode: values.ccode,
          cname: selectedCourse.cname,  // Added course name
          departments: selectedDepts,
          components,
          status: true
        };

        const res = await axios.post(`${config.url}/admin/addCourseMapping`, newMapping);

        if (res.data.success) {
          toast.success('Mapping created successfully!');
          onSuccess({
            ...newMapping,
            fmapid: res.data.data.fmapid,
            status: true,
            name: faculty.name,  // For immediate display in table
            cname: selectedCourse.cname  // For immediate display in table
          });
          closePopup();
        } else {
          throw new Error(res.data.toast || 'Failed to create mapping');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || 'Failed to create mapping');
        console.error('Error creating mapping:', err);
      } finally {
        setLoading(false);
      }
  };

  const filteredCourses = selectedDepts.length > 0
    ? courses.filter(course => 
        selectedDepts.some(dept => course.departments?.includes(dept)))
    : [];

  const filteredFaculties = selectedDepts.length > 0
    ? faculties.filter(faculty => 
        selectedDepts.includes(faculty.department))
    : [];

  const availableComponents = selectedCourse
    ? ['L', 'T', 'P', 'S'].filter(comp => selectedCourse[comp.toLowerCase()] > 0)
    : [];

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ marginBottom: 24, fontSize: '20px', fontWeight: '600' }}>
        Add New Course-Faculty Mapping
      </h2>
      
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Departments"
          name="departments"
          rules={[{ required: true, message: 'Please select at least one department!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select department(s)"
            size="large"
            onChange={handleDepartmentChange}
            maxTagCount="responsive"
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Course"
          name="ccode"
          rules={[{ required: true, message: 'Please select course!' }]}
        >
          <Select
            placeholder="Select course"
            size="large"
            disabled={selectedDepts.length === 0}
            onChange={handleCourseChange}
            showSearch
            optionFilterProp="children"
          >
            {filteredCourses.map(course => (
              <Option key={course.ccode} value={course.ccode}>
                {course.cname} ({course.ccode}) - LTP-S: {course.l}-{course.t}-{course.p}-{course.s}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Faculty"
          name="facultyId"
          rules={[{ required: true, message: 'Please select faculty!' }]}
        >
          <Select
            placeholder="Select faculty"
            size="large"
            disabled={selectedDepts.length === 0}
            showSearch
          >
            {filteredFaculties.map(faculty => (
              <Option key={faculty.id} value={faculty.id}>
                {faculty.name} ({faculty.id})
              </Option>
            ))}
          </Select>
        </Form.Item>

{selectedCourse && availableComponents.length > 0 && (
          <Form.Item
            label="Select Components"
            required
          >
            <Row gutter={16}>
              {availableComponents.map(component => (
                <Col span={6} key={component}>
                  <Checkbox
                    checked={selectedComponents.includes(component)}
                    onChange={(e) => handleComponentToggle(component, e.target.checked)}
                  >
                    {component} ({selectedCourse[component.toLowerCase()]} hours)
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Form.Item>
        )}

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              icon={<LinkOutlined />}
            >
              Create Mapping
            </Button>
            <Button
              htmlType="button"
              onClick={closePopup}
              size="large"
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminAddCourseMapping;