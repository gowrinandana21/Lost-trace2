const mongoose = require("mongoose")

const OfficerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"],
  },
  officerId: {
    type: String,
    required: [true, "Officer ID is required"],
    unique: true,
    trim: true,
  },
  areaOfJurisdiction: {
    type: String,
    required: [true, "Area of jurisdiction is required"],
    trim: true,
  },
  badgeNumber: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
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

module.exports = mongoose.model("Officer", OfficerSchema)

