const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Receipt = require('../models/Receipt');

exports.createPayment = async (req, res) => {
  try {
    const { enrollmentId, amountPaid, paymentMode, transactionId } = req.body;
    
    const enrollment = await Enrollment.findById(enrollmentId).populate('studentId');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const payment = new Payment({
      studentId: enrollment.studentId._id,
      enrollmentId,
      amountPaid,
      paymentMode,
      transactionId
    });
    await payment.save();

    // Update Enrollment
    enrollment.paidAmount += Number(amountPaid);
    enrollment.balance = enrollment.totalFees - enrollment.paidAmount;
    
    if (enrollment.balance <= 0) {
      enrollment.status = 'FULLY_PAID';
    } else if (enrollment.paidAmount > 0) {
      enrollment.status = 'PARTIAL';
    } else {
      enrollment.status = 'DUE';
    }
    await enrollment.save();

    // Create Receipt
    const receiptNo = `KTC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receipt = new Receipt({
      receiptNo,
      studentId: enrollment.studentId._id,
      enrollmentId,
      paymentId: payment._id,
      paidAmount: amountPaid,
      balance: enrollment.balance,
      status: enrollment.status
    });
    await receipt.save();

    res.status(201).json({ payment, receipt });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPaymentsByStudent = async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
