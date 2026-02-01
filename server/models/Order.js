const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Served', 'Paid'],
    default: 'Pending'
  },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true } // Storing price at time of order
  }],
  totalAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
