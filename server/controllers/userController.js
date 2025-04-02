const User = require("../models/User")

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit

    const users = await User.find().skip(skip).limit(limit).sort("-createdAt")

    // Get total count for pagination
    const total = await User.countDocuments()

    res.status(200).json({
      status: "success",
      results: users.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: {
        users,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get a single user (admin only)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with that ID",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Update user role (admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    // Only allow role update
    const { role } = req.body

    if (!role) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a role",
      })
    }

    // Check if role is valid
    if (!["user", "admin", "officer"].includes(role)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid role",
      })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with that ID",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with that ID",
      })
    }

    res.status(204).json({
      status: "success",
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

