const Activity = require('../models/Activity');

// Helper to log activities internally from other controllers
exports.logActivity = async (studentId, type, content, userId) => {
  try {
    const activity = new Activity({
      studentId,
      type,
      content,
      createdBy: userId
    });
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error.message);
  }
};

// POST /api/activities/:studentId (Create manual note)
exports.addNote = async (req, res) => {
  try {
    const { content } = req.body;
    const { studentId } = req.params;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const activity = new Activity({
      studentId,
      type: 'note',
      content,
      createdBy: req.user._id
    });

    await activity.save();
    await activity.populate('createdBy', 'name email');

    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/activities/:studentId
exports.getActivities = async (req, res) => {
  try {
    const { studentId } = req.params;
    const activities = await Activity.find({ studentId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
