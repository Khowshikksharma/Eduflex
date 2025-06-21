const Faculty = require('../models/Faculty');
const Circular = require('../models/Circular');

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

module.exports = {
    checkFacultyLogin,
    updateProfile,
    changeFacultyPassword,
    getCirculrByRole,
    markAsRead,
};