const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  tags: { type: [String], default: [] },
  address: { type: String },
  source: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
