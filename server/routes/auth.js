const express = require("express")
const authController = require("../controllers/authController")

const router = express.Router()

// Public routes
router.post("/register", authController.register)
router.post("/login", authController.login)

// Admin setup route (protected by setup key)
router.post("/create-admin", authController.createAdmin)

module.exports = router

