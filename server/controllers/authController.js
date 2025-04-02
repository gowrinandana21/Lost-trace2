const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Create and send JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  })
}

// Send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  // Remove password from output
  user.password = undefined

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  })
}

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    // Check if required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide username, email and password",
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

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      role: "user", // Default role is user
    })

    // Send token
    createSendToken(newUser, 201, res)
  } catch (error) {
    next(error)
  }
}

// Login user
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    // Check if username and password exist
    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide username and password",
      })
    }

    // Find user by username and explicitly select the password
    const user = await User.findOne({ username }).select("+password")

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect username or password",
      })
    }

    // Send token
    createSendToken(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// Create admin user (for initial setup)
exports.createAdmin = async (req, res, next) => {
  try {
    // Check if admin setup key is correct
    if (req.body.adminSetupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({
        status: "fail",
        message: "Invalid admin setup key",
      })
    }

    const { username, email, password } = req.body

    // Check if required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide username, email and password",
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

    // Create new admin user
    const newAdmin = await User.create({
      username,
      email,
      password,
      role: "admin",
    })

    // Send token
    createSendToken(newAdmin, 201, res)
  } catch (error) {
    next(error)
  }
}

