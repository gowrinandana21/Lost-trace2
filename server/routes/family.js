const express = require("express")
const familyController = require("../controllers/familyController")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// All routes are protected
router.use(authMiddleware.protect)

// Admin and officer routes
router.get("/", authMiddleware.restrictTo("admin", "officer"), familyController.getAllFamilyMembers)
router.get("/:id", authMiddleware.restrictTo("admin", "officer"), familyController.getFamilyMember)
router.post("/", authMiddleware.restrictTo("admin", "officer"), familyController.createFamilyMember)
router.put("/:id", authMiddleware.restrictTo("admin", "officer"), familyController.updateFamilyMember)

// Admin only routes
router.delete("/:id", authMiddleware.restrictTo("admin"), familyController.deleteFamilyMember)

module.exports = router