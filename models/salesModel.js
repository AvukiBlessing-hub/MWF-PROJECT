const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  productType: {
    type: String,
    enum: ["wood", "furniture"],
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
    min: 1,
  },
  quality: {
    type: String,
    enum: ["high", "medium", "low"],
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  transportFee: {
    type: Boolean,
    default: false,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "cheque", "bank-overdraft"],
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Sale || mongoose.model("Sale", SalesSchema);
