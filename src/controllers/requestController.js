const MaintenanceRequest = require("../models/MaintenanceRequest");

const createRequest = async (req, res, next) => {
  try {
    const { location, category, description } = req.body;

    if (!location || !location.hostel || !location.roomNumber || !location.area) {
      return res.status(400).json({
        success: false,
        message: "Hostel, room number and area are required",
      });
    }

    if (!category || !description) {
      return res.status(400).json({
        success: false,
        message: "Category and description are required",
      });
    }

    const request = await MaintenanceRequest.create({
      user: req.user._id,
      location,
      category,
      description,
      status: "Open",
    });

    const populatedRequest = await MaintenanceRequest.findById(request._id)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res.status(201).json({
      success: true,
      message: "Maintenance request created successfully",
      request: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    const requests = await MaintenanceRequest.find({
      user: req.user._id,
    })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

const getMyRequestById = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    next(error);
  }
};

const updateRequest = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    if (request.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "Only open requests can be updated",
      });
    }

    const { location, category, description } = req.body;

    if (location) {
      if (location.hostel !== undefined) {
        request.location.hostel = location.hostel;
      }

      if (location.roomNumber !== undefined) {
        request.location.roomNumber = location.roomNumber;
      }

      if (location.area !== undefined) {
        request.location.area = location.area;
      }
    }

    if (category !== undefined) {
      request.category = category;
    }

    if (description !== undefined) {
      request.description = description;
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: "Maintenance request updated successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
};

const cancelRequest = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    if (request.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "Only open requests can be cancelled",
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: "Maintenance request cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getMyRequestById,
  updateRequest,
  cancelRequest,
};