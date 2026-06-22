const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  receiptNo: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  paidAmount: { type: Number, required: true },
  balance: { type: Number, required: true },
  status: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);
