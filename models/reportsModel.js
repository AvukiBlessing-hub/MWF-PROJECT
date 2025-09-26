// models/reportsModel.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    enum: ["sales", "stock", "delivery"],
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  data: {
    type: mongoose.Schema.Types.Mixed, 
    required: true
  },
  generatedBy: {
    type: String, // optional: manager, system, etc.
    default: "system"
  }
});

module.exports = mongoose.model("Report", reportSchema);
