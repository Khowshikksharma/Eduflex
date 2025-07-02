import React, { useState, useEffect } from 'react';
import { Form, Button, Select, Space, Checkbox, Row, Col, message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import axios from 'axios';
import config from '../../config';

const { Option } = Select;

const AdminEditCourseMapping = ({ mappingData, departments = [], onUpdate, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState(mappingData.departments || []);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [courseComponents, setCourseComponents] = useState({
    L: 0,
    T: 0,
    P: 0,
    S: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, facultiesRes] = await Promise.all([
          axios.get(`${config.url}/admin/viewCourses`),
          axios.get(`${config.url}/admin/viewfaculties`)
        ]);
        setCourses(coursesRes.data);
        setFaculties(facultiesRes.data);

        // Initialize form with mapping data
        if (mappingData) {
          form.setFieldsValue({
            facultyId: mappingData.facultyId,
            ccode: mappingData.ccode,
            departments: mappingData.departments
          });

          // Find the course to set component settings
          const course = coursesRes.data.find(c => c.ccode === mappingData.ccode);
          if (course) {
            setSelectedCourse(course);
            setCourseComponents({
              L: course.l || 0,
              T: course.t || 0,
              P: course.p || 0,
              S: course.s || 0
            });

            // Initialize selected components from mapping data
            const initialSelected = mappingData.components
              ?.filter(comp => comp.hours > 0)
              .map(comp => comp.type) || [];
            
            setSelectedComponents(initialSelected);
          }
        }
      } catch (err) {
        message.error('Failed to load data');
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [mappingData, form]);

  const handleDepartmentChange = (values) => {
    setSelectedDepts(values);
    form.setFieldsValue({
      ccode: undefined
    });
    setSelectedCourse(null);
    setSelectedComponents([]);
    setCourseComponents({
      L: 0,
      T: 0,
      P: 0,
      S: 0
    });
  };

  const handleCourseChange = (value) => {
    const course = courses.find(c => c.ccode === value);
    setSelectedCourse(course);
    setCourseComponents({
      L: course.l || 0,
      T: course.t || 0,
      P: course.p || 0,
      S: course.s || 0
    });
    setSelectedComponents([]); // Reset selected components when course changes
  };

  const handleComponentToggle = (component, checked) => {
    setSelectedComponents(prev => 
      checked ? [...prev, component] : prev.filter(c => c !== component)
    );
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (selectedComponents.length === 0) {
        message.error('Please select at least one component');
        return;
      }

      const faculty = faculties.find(f => f.id === values.facultyId);
      if (!faculty) {
        message.error('Selected faculty not found');
        return;
      }

      // Prepare components array using the course's predefined hours
      const components = selectedComponents.map(type => ({
        type,
        hours: courseComponents[type] || 0
      }));

      const updatedMapping = {
        fmapid: mappingData.fmapid,
        facultyId: values.facultyId,
        facultyname: faculty.name,
        ccode: values.ccode,
        cname: selectedCourse.cname,
        departments: selectedDepts,
        components,
        status: mappingData.status
      };

      const res = await axios.put(`${config.url}/admin/updateCourseMapping`, updatedMapping);

      if (res.data.success) {
        message.success('Mapping updated successfully!');
        onUpdate({
          ...updatedMapping,
          name: faculty.name,
          cname: selectedCourse.cname,
          cshortname: mappingData.cshortname,
          credits: mappingData.credits,
          department: mappingData.department
        });
        onClose();
      } else {
        throw new Error(res.data.message || 'Failed to update mapping');
      }
    } catch (err) {
      message.error(err.response?.data?.message || err.message || 'Failed to update mapping');
      console.error('Error updating mapping:', err);
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

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ marginBottom: 24, fontSize: '20px', fontWeight: '600' }}>
        Edit Course-Faculty Mapping
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

        {selectedCourse && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8 }}>Select Components:</div>
            <Row gutter={16}>
              {Object.entries(courseComponents).map(([component, hours]) => (
                hours > 0 && (
                  <Col span={6} key={component}>
                    <Checkbox
                      checked={selectedComponents.includes(component)}
                      onChange={(e) => handleComponentToggle(component, e.target.checked)}
                    >
                      {component}({hours})
                    </Checkbox>
                  </Col>
                )
              ))}
            </Row>
          </div>
        )}

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

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              icon={<LinkOutlined />}
            >
              Update Mapping
            </Button>
            <Button
              htmlType="button"
              onClick={onClose}
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

export default AdminEditCourseMapping;