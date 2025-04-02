const Report = require("../models/Report")
const Officer = require("../models/Officer") // Import Officer model

// Get all reports (admin and officer only)
exports.getAllReports = async (req, res, next) => {
  try {
    const query = {}

    // Filter by missing person if provided
    if (req.query.missingPersonId) {
      query.missingPersonId = req.query.missingPersonId
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit

    const reports = await Report.find(query).skip(skip).limit(limit).sort("-createdAt")

    // Get total count for pagination
    const total = await Report.countDocuments(query)

    res.status(200).json({
      status: "success",
      results: reports.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: {
        reports,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get a single report (admin and officer only)
exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({
        status: "fail",
        message: "No report found with that ID",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        report,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Create a new report (admin and officer only)
exports.createReport = async (req, res, next) => {
  try {
    // Add user ID to request body
    req.body.createdBy = req.user.id

    // Add reporting officer if user is an officer
    if (req.user.role === "officer") {
      const officer = await Officer.findOne({ userId: req.user.id })
      if (officer) {
        req.body.reportingOfficer = officer.id
      }
    }

    const newReport = await Report.create(req.body)

    res.status(201).json({
      status: "success",
      data: {
        report: newReport,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Update a report (admin and officer only)
exports.updateReport = async (req, res, next) => {
  try {
    // Add updated timestamp
    req.body.updatedAt = Date.now()

    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!report) {
      return res.status(404).json({
        status: "fail",
        message: "No report found with that ID",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        report,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Delete a report (admin only)
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id)

    if (!report) {
      return res.status(404).json({
        status: "fail",
        message: "No report found with that ID",
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

