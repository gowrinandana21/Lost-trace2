const express = require("express")
const officerController = require("../controllers/officerController")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// All routes are protected and admin only
router.use(authMiddleware.protect)
router.use(authMiddleware.restrictTo("admin"))

router.get("/", officerController.getAllOfficers)
router.get("/:id", officerController.getOfficer)
router.post("/", officerController.createOfficer)
router.put("/:id", officerController.updateOfficer)
router.delete("/:id", officerController.deleteOfficer)

module.exports = router