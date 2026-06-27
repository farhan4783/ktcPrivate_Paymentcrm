const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const Receipt = require('../models/Receipt');

const escapeCSV = (val) => {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
};

// GET /api/export/students
exports.exportStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    const rows = [
      ['Name', 'Phone', 'Email', 'Address', 'Source', 'Tags', 'Courses', 'Total Fees', 'Paid Amount', 'Balance', 'Registered At']
    ];

    for (const student of students) {
      const enrollments = await Enrollment.find({ studentId: student._id });
      const totalFees = enrollments.reduce((sum, e) => sum + e.totalFees, 0);
      const paidAmount = enrollments.reduce((sum, e) => sum + e.paidAmount, 0);
      const balance = enrollments.reduce((sum, e) => sum + e.balance, 0);
      const courses = enrollments.map(e => e.courseName).join('; ');

      rows.push([
        student.name,
        student.phone,
        student.email,
        student.address || '',
        student.source || '',
        (student.tags || []).join('; '),
        courses,
        totalFees,
        paidAmount,
        balance,
        student.createdAt.toISOString()
      ]);
    }

    const csvContent = rows.map(r => r.map(escapeCSV).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/export/payments
exports.exportPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('studentId')
      .populate('enrollmentId')
      .sort({ createdAt: -1 });

    const rows = [
      ['Student Name', 'Student Phone', 'Student Email', 'Course Name', 'Amount Paid', 'Payment Mode', 'Transaction ID', 'Date']
    ];

    for (const payment of payments) {
      if (!payment.studentId) continue;
      rows.push([
        payment.studentId.name,
        payment.studentId.phone,
        payment.studentId.email,
        payment.enrollmentId ? payment.enrollmentId.courseName : 'N/A',
        payment.amountPaid,
        payment.paymentMode,
        payment.transactionId || 'N/A',
        payment.createdAt.toISOString()
      ]);
    }

    const csvContent = rows.map(r => r.map(escapeCSV).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payments.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/export/receipts
exports.exportReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate('studentId')
      .populate('enrollmentId')
      .sort({ createdAt: -1 });

    const rows = [
      ['Receipt Number', 'Student Name', 'Student Phone', 'Course Name', 'Paid Amount', 'Balance', 'Status', 'Date']
    ];

    for (const receipt of receipts) {
      if (!receipt.studentId) continue;
      rows.push([
        receipt.receiptNo,
        receipt.studentId.name,
        receipt.studentId.phone,
        receipt.enrollmentId ? receipt.enrollmentId.courseName : 'N/A',
        receipt.paidAmount,
        receipt.balance,
        receipt.status,
        receipt.createdAt.toISOString()
      ]);
    }

    const csvContent = rows.map(r => r.map(escapeCSV).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=receipts.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
