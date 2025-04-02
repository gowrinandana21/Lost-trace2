const FamilyMember = require("../models/FamilyMember")

// Get all family members (admin and officer only)
exports.getAllFamilyMembers = async (req, res, next) => {
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

    const familyMembers = await FamilyMember.find(query).skip(skip).limit(limit).sort("-createdAt")

    // Get total count for pagination
    const total = await FamilyMember.countDocuments(query)

    res.status(200).json({
      status: "success",
      results: familyMembers.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: {
        familyMembers,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get a single family member (admin and officer only)
exports.getFamilyMember = async (req, res, next) => {
  try {
    const familyMember = await FamilyMember.findById(req.params.id)

    if (!familyMember) {
      return res.status(404).json({
        status: "fail",
        message: "No family member found with that ID",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        familyMember,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Create a new family member (admin and officer only)
exports.createFamilyMember = async (req, res, next) => {
  try {
    // Add user ID to request body
    req.body.createdBy = req.user.id

    const newFamilyMember = await FamilyMember.create(req.body)

    res.status(201).json({
      status: "success",
      data: {
        familyMember: newFamilyMember,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Update a family member (admin and officer only)
exports.updateFamilyMember = async (req, res, next) => {
  try {
    // Add updated timestamp
    req.body.updatedAt = Date.now()

    const familyMember = await FamilyMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!familyMember) {
      return res.status(404).json({
        status: "fail",
        message: "No family member found with that ID",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        familyMember,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Delete a family member (admin only)
exports.deleteFamilyMember = async (req, res, next) => {
  try {
    const familyMember = await FamilyMember.findByIdAndDelete(req.params.id)

    if (!familyMember) {
      return res.status(404).json({
        status: "fail",
        message: "No family member found with that ID",
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

