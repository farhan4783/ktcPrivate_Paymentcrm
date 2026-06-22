const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { status: 'APPROVED' }, 
      { new: true, runValidators: false } // runValidators: false prevents password validation issues
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { status: 'REJECTED' }, 
      { new: true, runValidators: false }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User rejected', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
