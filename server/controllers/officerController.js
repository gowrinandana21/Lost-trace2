const Officer = require("../models/Officer")
const User = require("../models/User")
const bcrypt = require("bcrypt")

// Get all officers (admin only)
exports.getAllOfficers = async (req, res, next) => {
  try {
    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit

    const officers = await Officer.find().skip(skip).limit(limit).sort("-createdAt").populate("userId", "-password")

    // Get total count for pagination
    const total = await Officer.countDocuments()

    res.status(200).json({
      status: "success",
      results: officers.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: {
        officers,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get a single officer (admin only)
exports.getOfficer = async (req, res, next) => {
  try {
    const officer = await Officer.findById(req.params.id).populate("userId", "-password")

    if (!officer) {
      return res.status(404).json({
        status: "fail",
        message: "No officer found with that ID",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        officer,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Create a new officer (admin only)
exports.createOfficer = async (req, res, next) => {
  try {
    const { username, email, password, officerId, areaOfJurisdiction, badgeNumber, department } = req.body

    // Check if required fields are provided
    if (!username || !email || !password || !officerId || !areaOfJurisdiction) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide all required fields",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User with that email or username already exists",
      })
    }

    // Check if officer ID already exists
    const existingOfficer = await Officer.findOne({ officerId })

    if (existingOfficer) {
      return res.status(400).json({
        status: "fail",
        message: "Officer with that ID already exists",
      })
    }

    // Create new user with officer role
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "officer",
    })

    // Create officer record
    const newOfficer = await Officer.create({
      userId: newUser._id,
      officerId,
      areaOfJurisdiction,
      badgeNumber,
      department,
    })

    res.status(201).json({
      status: "success",
      data: {
        officer: {
          ...newOfficer._doc,
          user: {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
          },
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Update an officer (admin only)
exports.updateOfficer = async (req, res, next) => {
  try {
    // Add updated timestamp
    req.body.updatedAt = Date.now()

    const officer = await Officer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("userId", "-password")

    if (!officer) {
      return res.status(404).json({
        status: "fail",
        message: "No officer found with that ID",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        officer,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Delete an officer (admin only)
exports.deleteOfficer = async (req, res, next) => {
  try {
    const officer = await Officer.findById(req.params.id)

    if (!officer) {
      return res.status(404).json({
        status: "fail",
        message: "No officer found with that ID",
      })
    }

    // Delete user account associated with officer
    await User.findByIdAndDelete(officer.userId)

    // Delete officer record
    await Officer.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: "success",
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

