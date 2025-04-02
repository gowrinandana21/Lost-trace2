const MissingPerson = require("../models/MissingPerson")

// Get all missing persons (public)
exports.getAllMissingPersons = async (req, res, next) => {
  try {
    // Build query
    const queryObj = { ...req.query }
    const excludedFields = ["page", "sort", "limit", "fields"]
    excludedFields.forEach((field) => delete queryObj[field])

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = MissingPerson.find(JSON.parse(queryStr))

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-createdAt")
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ")
      query = query.select(fields)
    } else {
      query = query.select("-__v")
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    // Execute query
    const missingPersons = await query

    // Get total count for pagination
    const total = await MissingPerson.countDocuments(JSON.parse(queryStr))

    // Send response
    res.status(200).json({
      status: "success",
      results: missingPersons.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: {
        missingPersons,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get a single missing person (public)
exports.getMissingPerson = async (req, res, next) => {
  try {
    const missingPerson = await MissingPerson.findById(req.params.id)

    if (!missingPerson) {
      return res.status(404).json({
        status: "fail",
        message: "No missing person found with that ID",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        missingPerson,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Create a new missing person (admin only)
exports.createMissingPerson = async (req, res, next) => {
  try {
    // Add user ID to request body
    req.body.createdBy = req.user.id

    const newMissingPerson = await MissingPerson.create(req.body)

    res.status(201).json({
      status: "success",
      data: {
        missingPerson: newMissingPerson,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Update a missing person (admin only)
exports.updateMissingPerson = async (req, res, next) => {
  try {
    // Add updated timestamp
    req.body.updatedAt = Date.now()

    const missingPerson = await MissingPerson.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run validators
    })

    if (!missingPerson) {
      return res.status(404).json({
        status: "fail",
        message: "No missing person found with that ID",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        missingPerson,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Delete a missing person (admin only)
exports.deleteMissingPerson = async (req, res, next) => {
  try {
    const missingPerson = await MissingPerson.findByIdAndDelete(req.params.id)

    if (!missingPerson) {
      return res.status(404).json({
        status: "fail",
        message: "No missing person found with that ID",
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

// Search missing persons (public)
exports.searchMissingPersons = async (req, res, next) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a search query",
      })
    }

    const missingPersons = await MissingPerson.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } },
    ).sort({ score: { $meta: "textScore" } })

    res.status(200).json({
      status: "success",
      results: missingPersons.length,
      data: {
        missingPersons,
      },
    })
  } catch (error) {
    next(error)
  }
}

