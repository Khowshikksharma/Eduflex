const nodemailer = require('nodemailer');
require('dotenv').config();

const sendStudentWelcomeEmail = async (student) => {
    const htmlBody = `<!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; }
                .student-id { background: #e8f4fd; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; border-radius: 5px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎓 Welcome to EduFlex!</h1>
                </div>
                <div class="content">
                    <h2>Dear ${student.name},</h2>
                    <p>We're thrilled to welcome you to the <strong>EduFlex</strong> family! Your registration has been completed successfully.</p>
                    
                    <div class="student-id">
                        <strong>📋 Your Student ID:</strong> <code>${student.id}</code>
                    </div>
                    
                    <p>With EduFlex, you now have access to:</p>
                    <ul>
                        <li>📚 Comprehensive course materials</li>
                        <li>👥 Interactive learning community</li>
                        <li>📊 Progress tracking tools</li>
                        <li>🎯 Personalized learning paths</li>
                    </ul>
                    
                    <div style="text-align: center;">
                        <a href="#" class="button">Get Started</a>
                    </div>
                    
                    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                </div>
                <div class="footer">
                    <p><strong>Best regards,</strong><br>
                    The EduFlex Team<br>
                    📧 support@eduflex.com | 📞 1-800-EDUFLEX</p>
                </div>
            </div>
        </body>
        </html>`;
    await userSendMail(student.email, 'Welcome to EduFlex', htmlBody);
}

const sendFacultyWelcomeEmail = async (faculty) => {
    const htmlBody = `<!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; }
                .faculty-id { background: #e8f4fd; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; border-radius: 5px; }
                .next-steps { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 5px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎓 Welcome to EduFlex Faculty!</h1>
                </div>
                <div class="content">
                    <h2>Dear Professor ${faculty.name},</h2>
                    <p>We're delighted to welcome you to the <strong>EduFlex</strong> teaching community! Your faculty registration has been completed successfully.</p>
                    
                    <div class="faculty-id">
                        <strong>👨‍🏫 Your Faculty ID:</strong> <code>${faculty.id}</code><br>
                        <strong>🏛️ Department:</strong> <code>${faculty.department || 'Not specified'}</code><br>
                        <strong>📧 Email:</strong> <code>${faculty.email}</code>
                    </div>
                    
                    <p>As an EduFlex faculty member, you now have access to:</p>
                    <ul>
                        <li>📋 <strong>Course Management System</strong> - Create and manage your courses</li>
                        <li>👥 <strong>Student Analytics Dashboard</strong> - Track student progress and engagement</li>
                        <li>📝 <strong>Assignment & Assessment Tools</strong> - Create tests, quizzes, and assignments</li>
                        <li>💬 <strong>Communication Hub</strong> - Connect with students and colleagues</li>
                        <li>📊 <strong>Grade Management</strong> - Efficient grading and feedback system</li>
                        <li>📚 <strong>Resource Library</strong> - Access to teaching materials and resources</li>
                        <li>🎯 <strong>Learning Analytics</strong> - Data-driven insights for better teaching</li>
                    </ul>

                    <div class="next-steps">
                        <strong>🔑 Next Steps:</strong>
                        <ol style="margin: 10px 0; padding-left: 20px;">
                            <li>Complete your faculty profile setup</li>
                            <li>Explore the course creation wizard</li>
                            <li>Join our faculty orientation session</li>
                            <li>Connect with your department coordinator</li>
                        </ol>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="#" class="button">Access Faculty Portal</a>
                    </div>
                    
                    <p>If you have any questions or need assistance with the platform, our dedicated faculty support team is here to help.</p>
                </div>
                <div class="footer">
                    <p><strong>Best regards,</strong><br>
                    The EduFlex Academic Team<br>
                    📧 faculty-support@eduflex.com | 📞 1-800-EDUFLEX-FACULTY<br>
                    🌐 <a href="#" style="color: #667eea;">faculty.eduflex.com</a></p>
                </div>
            </div>
        </body>
        </html>`;
    await userSendMail(faculty.email, 'Welcome to EduFlex Faculty', htmlBody);
}

const userSendMail = async (to, subject, body) => {
    // console.log('userSendMail called with:', { to, subject });
    try {
        let config = {
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASSWORD,
            }
        }

        let transporter = nodemailer.createTransport(config);

        let mailOptions = {
            from: `"EduFlex" <${process.env.MAIL}>`, // ✅ Uses backticks and ${} 
            to: to,
            subject: subject,
            html: body 
        }
        const info = await transporter.sendMail(mailOptions);
        // console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = { 
    sendStudentWelcomeEmail,
    sendFacultyWelcomeEmail,
};