const express = require("express")
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// All routes are protected and admin only
router.use(authMiddleware.protect)
router.use(authMiddleware.restrictTo("admin"))

router.get("/", userController.getAllUsers)
router.get("/:id", userController.getUser)
router.patch("/:id/role", userController.updateUserRole)
router.delete("/:id", userController.deleteUser)

module.exports = router