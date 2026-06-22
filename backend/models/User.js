const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide your name'] 
  },
  email: { 
    type: String, 
    required: [true, 'Please provide your email'], 
    unique: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: [true, 'Please provide a password'],
    select: false // Don't return password by default
  },
  role: { 
    type: String, 
    enum: ['admin', 'staff'], 
    default: 'staff' 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
