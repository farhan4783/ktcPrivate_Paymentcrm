const Receipt = require('../models/Receipt');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Payment = require('../models/Payment');

exports.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate('studentId', 'name email phone')
      .populate('enrollmentId')
      .sort({ createdAt: -1 });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('studentId')
      .populate('enrollmentId')
      .populate('paymentId');
    if (!receipt) return res.status(404).json({ message: 'Receipt not found' });
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateReceipt = async (req, res) => {
  try {
    const { 
      name, phone, email, course, 
      totalFees, amountPaid, paymentMode, transactionId 
    } = req.body;

    // 1. Find or Create Student
    let student = await Student.findOne({ $or: [{ phone }, { email }] });
    if (!student) {
      student = new Student({ name, phone, email });
      await student.save();
    }

    // 2. Create/Find Enrollment
    let enrollment = await Enrollment.findOne({ studentId: student._id, courseName: course });
    if (!enrollment) {
      enrollment = new Enrollment({
        studentId: student._id,
        courseName: course,
        totalFees,
        balance: totalFees
      });
      await enrollment.save();
    } else if (totalFees) {
      enrollment.totalFees = Number(totalFees);
    }

    // 3. Create Payment
    const payment = new Payment({
      studentId: student._id,
      enrollmentId: enrollment._id,
      amountPaid,
      paymentMode,
      transactionId
    });
    await payment.save();

    // 4. Update Enrollment Stats
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

    // 5. Create Receipt
    const receiptNo = `KTC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receipt = new Receipt({
      receiptNo,
      studentId: student._id,
      enrollmentId: enrollment._id,
      paymentId: payment._id,
      paidAmount: amountPaid,
      balance: Number(totalFees) - Number(amountPaid),
      status: Number(amountPaid) >= Number(totalFees) ? 'FULLY_PAID' : 'PARTIAL'
    });
    await receipt.save();

    // Populate for response
    const fullReceipt = await Receipt.findById(receipt._id)
      .populate('studentId')
      .populate('enrollmentId')
      .populate('paymentId');

    res.status(201).json(fullReceipt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
