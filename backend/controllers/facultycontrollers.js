const Faculty = require('../models/Faculty');
const Circular = require('../models/Circular');
const fs = require('fs');
const path = require('path');

const checkFacultyLogin = async (req, res) => {
    try {
        const input = req.body;
        console.log(input);
        const faculty = await Faculty.findOne(input);
        res.json(faculty);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateProfile = async (req, res) => {
  try{
    const input = req.body;
    const facultyId = input.facultyid;
    const updateData = await Faculty.findOneAndUpdate(
      { id: facultyId },
      input,
      { new: true }
    );
    if (!updateData) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.json(updateData);
  }catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const changeFacultyPassword = async (req, res) => {
  try {
    const { facultyId, oldPassword, newPassword } = req.body;
    const faculty = await Faculty.findOne({id:facultyId});
    if( !faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    if (faculty.password !== oldPassword) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    faculty.password = newPassword;
    await faculty.save();
    res.status(200).json({ status: 200, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ status: 500, message: 'Error updating password', error: error.message });
  }
};

const getCirculrByRole = async(req,res) => {
  try{
    const circulars = await Circular.find({ recipientGroups: { $in: ['faculty'] } }).sort({createdAt:-1});
    res.json(circulars);
  }catch(error){
    res.status(500).json(error);
  }
}

const getCircularCount = async (req, res) => {
  const userId = req.params.id;
  try {
    const circulars = await Circular.find({ recipientGroups: { $in: ['faculty'] } }).sort({ createdAt: -1 });
    const unreadCount = circulars.filter(circular => !circular.readBy.includes(userId)).length;
    res.json(unreadCount);
  } catch (error) {
    console.error('Error fetching circular count:', error);
    res.status(500).json({ error: 'Failed to fetch circular count' });
  }
}

const markAsRead = async(req,res) => {
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
  }catch(error){
    res.status(500).json({ error: 'Failed to mark as read' });
  }
}

const downloadAttachment = async (req, res) => {
  try {
    const { circularId, attachmentId } = req.params;
    const circular = await Circular.findById(circularId);
    // console.log('recipientGroups:', circular.recipientGroups);
    // console.log('includes faculty:', circular.recipientGroups.includes('faculty'));
    // console.log('circularId:', circularId, 'attachmentId:', attachmentId);
    if (!circular) {
      return res.status(404).json({ error: 'Circular not found' });
    }
    if (!circular.recipientGroups.includes('faculty')) {
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
    // console.error('Download Error:', error); 
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};


module.exports = {
    checkFacultyLogin,
    updateProfile,
    changeFacultyPassword,
    getCirculrByRole,
    getCircularCount,
    markAsRead,
    downloadAttachment,
};