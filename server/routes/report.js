const express = require("express")
const reportController = require("../controllers/reportController")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// All routes are protected
router.use(authMiddleware.protect)

// Admin and officer routes
router.get("/", authMiddleware.restrictTo("admin", "officer"), reportController.getAllReports)
router.get("/:id", authMiddleware.restrictTo("admin", "officer"), reportController.getReport)
router.post("/", authMiddleware.restrictTo("admin", "officer"), reportController.createReport)
router.put("/:id", authMiddleware.restrictTo("admin", "officer"), reportController.updateReport)

// Admin only routes
router.delete("/:id", authMiddleware.restrictTo("admin"), reportController.deleteReport)

module.exports = router