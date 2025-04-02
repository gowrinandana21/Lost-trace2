const mongoose = require("mongoose")

const ReportSchema = new mongoose.Schema({
  missingPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MissingPerson",
    required: [true, "Missing person reference is required"],
  },
  policeReportNumber: {
    type: String,
    required: [true, "Police report number is required"],
    trim: true,
  },
  recordNumber: {
    type: String,
    trim: true,
  },
  reportDetails: {
    type: String,
    trim: true,
  },
  reportDate: {
    type: Date,
    default: Date.now,
  },
  reportingOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Officer",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Report", ReportSchema)

