const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseName: { type: String, required: true },
  totalFees: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  balance: { type: Number, required: true },
  status: { type: String, enum: ['FULLY_PAID', 'PARTIAL', 'DUE'], default: 'DUE' }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
