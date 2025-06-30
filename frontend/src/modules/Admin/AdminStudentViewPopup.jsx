import { Descriptions, Tag, Button, Space } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';

const AdminStudentViewPopup = ({ studentData, onEdit, onClose }) => {
  const studentDetails = [
    { label: 'ID', value: studentData.id },
    { label: 'Name', value: studentData.name },
    { label: 'Department', value: studentData.department },
    { label: 'Age', value: studentData.age },
    { label: 'Date of Birth', value: studentData.dob },
    { label: 'Gender', value: studentData.gender },
    { label: 'Email', value: studentData.email },
    { label: 'Phone No.', value: studentData.phone },
    { label: 'Aadhaar No.', value: studentData.aadhaarNo },
    { 
      label: 'Semester Fee', 
      value: `₹${(studentData.semesterFee || 0).toLocaleString('en-IN')}` 
    },
    { label: 'Qualification', value: studentData.qualification },
    { label: 'Father Name', value: studentData.fatherName },
    { label: 'Start Year', value: studentData.startYear },
    { label: 'End Year', value: studentData.endYear },
    { 
      label: 'Status', 
      value: (
        <Tag color={studentData.status ? 'green' : 'red'}>
          {studentData.status ? 'Active' : 'Inactive'}
        </Tag>
      ) 
    },
    { 
      label: 'Current Year', 
      value: `${studentData.currentYear}${studentData.currentYear === '1' ? 'st' : studentData.currentYear === '2' ? 'nd' : studentData.currentYear === '3' ? 'rd' : 'th'} Year` 
    },
    { 
      label: 'Current Semester', 
      value: `Semester ${studentData.currentSemester}` 
    },
    { label: 'Marital Status', value: studentData.maritalStatus },
    { label: 'Mother Tongue', value: studentData.motherTongue },
    { label: 'Nationality', value: studentData.nationality },
    { label: 'Address', value: studentData.address, span: 2 },
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
            ID : {studentData.id}
          </h3>
          <h5>Status: &nbsp;
            <Tag color={studentData.status ? 'green' : 'red'}>
              {studentData.status ? 'Active' : 'Inactive'}
            </Tag>
          </h5>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(studentData)}
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
        {studentDetails.map((item, index) => {
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

export default AdminStudentViewPopup;