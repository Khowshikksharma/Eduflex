const Student = require('../models/Student');
const Circular = require('../models/Circular');
const path = require('path');
const fs = require('fs');

const checkStudentLogin = async (req, res) => {
    try {
        const input = req.body;
        const student = await Student.findOne(input);
        res.json(student);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateProfile = async (req, res) => {
  try {
    const input = req.body;
    const studentId = input.studentid;
    const updateData = await Student.findOneAndUpdate(
      { id: studentId },
      input,
      { new: true }
    );
    if (!updateData) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updateData);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const changeStudnetPassword = async (req, res) => {
  try {
    const { studentId, oldPassword, newPassword } = req.body;
    const student = await Student.findOne({ id: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.password !== oldPassword) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    student.password = newPassword;
    await student.save();
    res.status(200).json({ status: 200, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error updating password', error: error.message });
  }
};

const getCirculrByRole = async(req,res) => {
  try{
    const circulars = await Circular.find({ recipientGroups: { $in: ['students'] } }).sort({createdAt:-1});
    res.json(circulars);
  }catch(error){
    res.status(500).json(error);
  }
}

const getCircularCount = async (req, res) => {
  const userId = req.params.id;
  try {
    const circulars = await Circular.find({ recipientGroups: { $in: ['students'] } }).sort({ createdAt: -1 });
    const unreadCount = circulars.filter(c => !c.readBy.includes(userId)).length;
     res.json(unreadCount);
  } catch (error) {
    res.status(500).json(error);
  }
};

const markAsRead = async (req, res) => {
  const circularId = req.params.id;
  const user = req.body.user;

  if (!user) return res.status(400).json({ error: 'User identifier is required' });

  try {
    const circular = await Circular.findById(circularId);
    if (!circular) return res.status(404).json({ error: 'Circular not found' });

    if (!circular.readBy.includes(user)) {
      circular.readBy.push(user);
      await circular.save();
    }

    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

const downloadAttachment = async (req, res) => {
  try {
    const { circularId, attachmentId } = req.params;
    const circular = await Circular.findById(circularId);
    if (!circular) {
      return res.status(404).json({ error: 'Circular not found' });
    }
    if (!circular.recipientGroups.includes('students')) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const attachment = circular.attachments.find(att => att._id.toString() === attachmentId);
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }
    const filePath = path.join(__dirname, '..', 'uploads', attachment.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }
    const stats = fs.statSync(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.name}"`);
    res.setHeader('Content-Length', stats.size);
    const ext = path.extname(attachment.name).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.csv': 'text/csv'
    };
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error reading file' });
      }
    });
    fileStream.pipe(res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = {
  checkStudentLogin,
  updateProfile,
  changeStudnetPassword,
  getCirculrByRole,
  getCircularCount,
  markAsRead,
  downloadAttachment
};
