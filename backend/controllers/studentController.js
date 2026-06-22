const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');

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
