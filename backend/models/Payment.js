const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  amountPaid: { type: Number, required: true },
  paymentMode: { type: String, enum: ['UPI', 'Cash', 'Bank'], required: true },
  transactionId: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
