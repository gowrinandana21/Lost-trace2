const mongoose = require("mongoose")

const MissingPersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  age: {
    type: Number,
    min: [0, "Age cannot be negative"],
  },
  lastSeenLocation: {
    type: String,
    required: [true, "Last seen location is required"],
  },
  description: {
    type: String,
    trim: true,
  },
  additionalDetails: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "found", "closed"],
    default: "active",
  },
  photo: {
    type: String, // URL to photo
  },
  dateLastSeen: {
    type: Date,
    default: Date.now,
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

// Add text index for search functionality
MissingPersonSchema.index({
  name: "text",
  description: "text",
  lastSeenLocation: "text",
  additionalDetails: "text",
})

module.exports = mongoose.model("MissingPerson", MissingPersonSchema)

