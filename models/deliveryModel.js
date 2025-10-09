// models/deliveryModel.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  transport: {
    type: Boolean,
    default: false,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ["pending", "dispatched", "delivered"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
