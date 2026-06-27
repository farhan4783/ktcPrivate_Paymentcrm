const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Student = require('./models/Student');
const Payment = require('./models/Payment');
const Enrollment = require('./models/Enrollment');
const Receipt = require('./models/Receipt');
const studentController = require('./controllers/studentController');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const user = await User.findOne({ role: 'admin' });
    console.log('Admin User:', user ? { _id: user._id, email: user.email } : 'None');

    const student = await Student.findOne({});
    console.log('Student:', student ? { _id: student._id, name: student.name } : 'None');

    if (student) {
      const enrollment = await Enrollment.findOne({ studentId: student._id });
      console.log('Enrollment:', enrollment ? { _id: enrollment._id, courseName: enrollment.courseName } : 'None');

      const payment = await Payment.findOne({ studentId: student._id });
      console.log('Payment:', payment ? { _id: payment._id, amountPaid: payment.amountPaid } : 'None');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
