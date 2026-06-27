const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const Receipt = require('../models/Receipt');

exports.createStudent = async (req, res) => {
  try {
    const { name, phone, email, course, totalFees } = req.body;
    
    // 1. Find or create student
    let student = await Student.findOne({ $or: [{ phone }, { email }] });
    if (!student) {
      student = new Student({ name, phone, email });
      await student.save();
    }

    // 2. Create enrollment for the course
    const enrollment = new Enrollment({
      studentId: student._id,
      courseName: course,
      totalFees,
      balance: totalFees
    });
    await enrollment.save();

    res.status(201).json({ student, enrollment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    
    // Fetch enrollments for each student to show aggregate status
    const studentsWithData = await Promise.all(students.map(async (student) => {
      const enrollments = await Enrollment.find({ studentId: student._id });
      const totalFees = enrollments.reduce((sum, e) => sum + e.totalFees, 0);
      const paidAmount = enrollments.reduce((sum, e) => sum + e.paidAmount, 0);
      const balance = enrollments.reduce((sum, e) => sum + e.balance, 0);
      
      return {
        ...student._doc,
        enrollments,
        totalFees,
        paidAmount,
        balance,
        course: enrollments.length > 1 ? `${enrollments[0].courseName} +${enrollments.length - 1}` : enrollments[0]?.courseName || 'No Enrollment'
      };
    }));

    res.json(studentsWithData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    const enrollments = await Enrollment.find({ studentId: req.params.id }).sort({ createdAt: -1 });
    const payments = await Payment.find({ studentId: req.params.id }).sort({ createdAt: -1 });
    
    res.json({
      ...student._doc,
      enrollments,
      payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addEnrollment = async (req, res) => {
  try {
    const { courseName, totalFees } = req.body;
    const studentId = req.params.id;

    const enrollment = new Enrollment({
      studentId,
      courseName,
      totalFees,
      balance: totalFees
    });
    await enrollment.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ========== EDIT / DELETE OPERATIONS ==========

// Update student details (name, phone, email)
exports.updateStudent = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const student = await Student.findById(req.params.id);
    
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check for duplicate phone/email if changed
    if (phone && phone !== student.phone) {
      const existing = await Student.findOne({ phone, _id: { $ne: student._id } });
      if (existing) return res.status(400).json({ message: 'Phone number already in use by another student' });
    }
    if (email && email !== student.email) {
      const existing = await Student.findOne({ email, _id: { $ne: student._id } });
      if (existing) return res.status(400).json({ message: 'Email already in use by another student' });
    }

    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (email) student.email = email;

    await student.save();
    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a student and all their enrollments, payments, receipts
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Cascade delete all related data
    await Receipt.deleteMany({ studentId: req.params.id });
    await Payment.deleteMany({ studentId: req.params.id });
    await Enrollment.deleteMany({ studentId: req.params.id });
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: 'Student and all related records deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an enrollment (courseName, totalFees)
exports.updateEnrollment = async (req, res) => {
  try {
    const { courseName, totalFees } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    if (courseName) enrollment.courseName = courseName;
    if (totalFees !== undefined) {
      enrollment.totalFees = Number(totalFees);
      enrollment.balance = enrollment.totalFees - enrollment.paidAmount;
      
      // Recalculate status
      if (enrollment.balance <= 0) {
        enrollment.status = 'FULLY_PAID';
        enrollment.balance = 0;
      } else if (enrollment.paidAmount > 0) {
        enrollment.status = 'PARTIAL';
      } else {
        enrollment.status = 'DUE';
      }
    }

    await enrollment.save();
    res.json({ message: 'Enrollment updated successfully', enrollment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an enrollment and its payments/receipts
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    // Delete associated payments and receipts
    await Receipt.deleteMany({ enrollmentId: req.params.enrollmentId });
    await Payment.deleteMany({ enrollmentId: req.params.enrollmentId });
    await Enrollment.findByIdAndDelete(req.params.enrollmentId);

    res.json({ message: 'Enrollment and related records deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a payment (amountPaid, paymentMode, transactionId)
exports.updatePayment = async (req, res) => {
  try {
    const { amountPaid, paymentMode, transactionId } = req.body;
    const payment = await Payment.findById(req.params.paymentId);
    
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const oldAmount = payment.amountPaid;

    if (amountPaid !== undefined) payment.amountPaid = Number(amountPaid);
    if (paymentMode) payment.paymentMode = paymentMode;
    if (transactionId !== undefined) payment.transactionId = transactionId;

    await payment.save();

    // Recalculate enrollment totals if amount changed
    if (amountPaid !== undefined && Number(amountPaid) !== oldAmount) {
      const enrollment = await Enrollment.findById(payment.enrollmentId);
      if (enrollment) {
        // Recalculate paidAmount from all payments
        const allPayments = await Payment.find({ enrollmentId: enrollment._id });
        enrollment.paidAmount = allPayments.reduce((sum, p) => sum + p.amountPaid, 0);
        enrollment.balance = enrollment.totalFees - enrollment.paidAmount;
        
        if (enrollment.balance <= 0) {
          enrollment.status = 'FULLY_PAID';
          enrollment.balance = 0;
        } else if (enrollment.paidAmount > 0) {
          enrollment.status = 'PARTIAL';
        } else {
          enrollment.status = 'DUE';
        }
        await enrollment.save();
      }

      // Update the corresponding receipt if exists
      const receipt = await Receipt.findOne({ paymentId: payment._id });
      if (receipt) {
        receipt.paidAmount = payment.amountPaid;
        const enrollment2 = await Enrollment.findById(payment.enrollmentId);
        receipt.balance = enrollment2 ? enrollment2.balance : 0;
        receipt.status = enrollment2 ? enrollment2.status : receipt.status;
        await receipt.save();
      }
    }

    res.json({ message: 'Payment updated successfully', payment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a payment and recalculate enrollment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Delete associated receipt
    await Receipt.deleteMany({ paymentId: req.params.paymentId });
    await Payment.findByIdAndDelete(req.params.paymentId);

    // Recalculate enrollment
    const enrollment = await Enrollment.findById(payment.enrollmentId);
    if (enrollment) {
      const remainingPayments = await Payment.find({ enrollmentId: enrollment._id });
      enrollment.paidAmount = remainingPayments.reduce((sum, p) => sum + p.amountPaid, 0);
      enrollment.balance = enrollment.totalFees - enrollment.paidAmount;
      
      if (enrollment.balance <= 0) {
        enrollment.status = 'FULLY_PAID';
        enrollment.balance = 0;
      } else if (enrollment.paidAmount > 0) {
        enrollment.status = 'PARTIAL';
      } else {
        enrollment.status = 'DUE';
      }
      await enrollment.save();
    }

    res.json({ message: 'Payment and receipt deleted, enrollment recalculated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
