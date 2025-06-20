import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../../config';

const FacultyCircular = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [facultyData, setFacultyData] = useState(null);
  const storedData = sessionStorage.getItem('faculty');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFacultyData(parsedData);
    }
  }, [storedData]);

  const fetchCirculars = async () => {
    if (!facultyData) return;

    try {
      const res = await axios.get(`${config.url}/faculty/getCirculars`);
      const data = res.data.map((circular) => ({
        id: circular._id,
        subject: circular.subject,
        sender: 'admin@university.edu',
        date: circular.createdAt,
        body: circular.description,
        read: circular.readBy.includes(facultyData.id),
        attachments: circular.attachments?.map(file => file.name) || [],
      }));
      setEmails(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch circulars:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCirculars();
    intervalRef.current = setInterval(fetchCirculars, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEmailClick = async (email) => {
    setSelectedEmail(email);
    setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e));

    try {
      await axios.put(`${config.url}/faculty/markAsRead/${email.id}`, {
        user: facultyData.id
      });
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading circulars...</div>;
  }

  return (
    <div className="email-container" style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Left side - Email List */}
      <div className="email-list" style={{ 
        width: '35%', 
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
          <h1>Faculty Circulars</h1>
          <small style={{ color: 'green' }}>Auto-refreshing every second</small>
        </div>
        <div className="search-bar" style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
          <input
            type="text"
            placeholder="Search circulars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => handleEmailClick(email)}
              style={{
                padding: '15px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                backgroundColor: email.read ? '#fff' : '#f0f7ff',
                fontWeight: email.read ? 'normal' : 'bold',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{email.sender}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>{formatDate(email.date)}</span>
              </div>
              <div style={{ 
                fontSize: '14px', 
                marginBottom: '5px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {email.subject}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#666',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {email.body.split('\n')[0]}
              </div>
              {email.attachments.length > 0 && (
                <div style={{ fontSize: '12px', color: '#0078d4', marginTop: '5px' }}>
                  <i className="fa fa-paperclip" style={{ marginRight: '5px' }}></i>
                  {email.attachments.length} attachment{email.attachments.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Email Content */}
      <div className="email-content" style={{ 
        width: '65%',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {selectedEmail ? (
          <div style={{ 
            padding: '20px',
            overflowY: 'auto',
            flex: 1,
            wordWrap: 'break-word'
          }}>
            <h2 style={{ marginBottom: '10px' }}>{selectedEmail.subject}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#666' }}>
              <div>
                <span style={{ fontWeight: 'bold', color: '#333' }}>From: </span>
                {selectedEmail.sender}
              </div>
              <div>{formatDate(selectedEmail.date)}</div>
            </div>

            <div style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              overflowWrap: 'break-word'
            }}>
              {selectedEmail.body}
            </div>

            {selectedEmail.attachments.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>Attachments</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedEmail.attachments.map((file, index) => (
                    <li key={index} style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '5px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <i className="fa fa-file" style={{ marginRight: '10px', color: '#666' }}></i>
                      {file}
                      <button style={{
                        marginLeft: 'auto',
                        backgroundColor: '#0078d4',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: '#666'
          }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fa fa-envelope-open" style={{ fontSize: '48px', marginBottom: '20px' }}></i>
              <h2>Select a circular to read</h2>
              <p>Choose a message from the list to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyCircular;