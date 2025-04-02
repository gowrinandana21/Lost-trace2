const express = require("express")
const missingPersonController = require("../controllers/missingPersonController")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// Public routes
router.get("/", missingPersonController.getAllMissingPersons)
router.get("/search", missingPersonController.searchMissingPersons)
router.get("/:id", missingPersonController.getMissingPerson)

// Protected routes - admin only
router.use(authMiddleware.protect)
router.post("/", authMiddleware.restrictTo("admin"), missingPersonController.createMissingPerson)
router.put("/:id", authMiddleware.restrictTo("admin"), missingPersonController.updateMissingPerson)
router.delete("/:id", authMiddleware.restrictTo("admin"), missingPersonController.deleteMissingPerson)

module.exports = router