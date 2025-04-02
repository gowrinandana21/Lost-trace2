const mongoose = require("mongoose")

const FamilyMemberSchema = new mongoose.Schema({
  missingPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MissingPerson",
    required: [true, "Missing person reference is required"],
  },
  relationship: {
    type: String,
    required: [true, "Relationship is required"],
    trim: true,
  },
  contactPhone: {
    type: String,
    required: [true, "Contact phone is required"],
    trim: true,
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
  },
  address: {
    type: String,
    trim: true,
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

module.exports = mongoose.model("FamilyMember", FamilyMemberSchema)

