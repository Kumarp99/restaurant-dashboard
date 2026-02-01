const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'],
    required: true
  },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  ingredients: { type: String, default: '' } // Added for search
}, { timestamps: true });

// Create a text index for searching
menuItemSchema.index({ name: 'text', ingredients: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);