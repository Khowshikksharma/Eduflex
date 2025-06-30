import { Descriptions, Tag, Button, Space } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';

const AdminFacultyViewPopup = ({ facultyData, onEdit, onClose }) => {
  const facultyDetails = [
    { label: 'ID', value: facultyData.id },
    { label: 'Name', value: facultyData.name },
    { label: 'Department', value: facultyData.department },
    { label: 'Age', value: facultyData.age },
    { label: 'Date of Birth', value: facultyData.dob },
    { label: 'Gender', value: facultyData.gender },
    { label: 'Email', value: facultyData.email },
    { label: 'Phone No.', value: facultyData.phone },
    { label: 'Aadhaar No.', value: facultyData.aadhaarNo },
    { 
      label: 'Salary', 
      value: `₹${(facultyData.salary || 0).toLocaleString('en-IN')}` 
    },
    { label: 'Qualification', value: facultyData.qualification },
    { label: 'Designation', value: facultyData.designation },
    { label: 'Father Name', value: facultyData.fatherName },
    { label: 'Joining Date', value: facultyData.startYear },
    { label: 'Experience', value: facultyData.experience },
    { 
      label: 'Status', 
      value: (
        <Tag color={facultyData.status ? 'green' : 'red'}>
          {facultyData.status ? 'Active' : 'Resigned'}
        </Tag>
      ) 
    },
    { label: 'Marital Status', value: facultyData.maritalStatus },
    { label: 'Mother Tongue', value: facultyData.motherTongue },
    { label: 'Nationality', value: facultyData.nationality },
    { label: 'Address', value: facultyData.address, span: 2 },
  ];

  return (
    <div>
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'white',
        zIndex: 100,
        marginTop: '10px',
        padding: '5px',
        alignItems: 'center',
        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '5px',
          marginBottom: '5px'
        }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            ID : {facultyData.id}
          </h3>
          <h5>Status: &nbsp;
            <Tag color={facultyData.status ? 'green' : 'red'}>
              {facultyData.status ? 'Active' : 'Resigned'}
            </Tag>
          </h5>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(facultyData)}
            >
              Edit
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={onClose}
            >
              Close
            </Button>
          </Space>
        </div>
      </div>

      <Descriptions
        bordered
        column={2}
        size="middle"
        labelStyle={{
          fontWeight: 600,
          width: '150px',
          backgroundColor: '#fafafa'
        }}
        contentStyle={{ backgroundColor: '#fff' }}
      >
        {facultyDetails.map((item, index) => {
          if (item.label === 'ID' || item.label === 'Status') {
            return null;
          }

          if (item.span === 2) {
            return (
              <Descriptions.Item
                label={item.label}
                span={2}
                key={index}
              >
                {item.value || '—'}
              </Descriptions.Item>
            );
          }

          return (
            <Descriptions.Item
              label={item.label}
              span={item.span || 1}
              key={index}
            >
              {item.value || '—'}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </div>
  );
};

export default AdminFacultyViewPopup;