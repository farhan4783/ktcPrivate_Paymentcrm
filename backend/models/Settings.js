const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'KTC Career' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  upiId: { type: String, default: '' },
  receiptPrefix: { type: String, default: 'KTC' },
  logoUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
