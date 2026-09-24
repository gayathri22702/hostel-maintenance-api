const MaintenanceRequest = require("../models/MaintenanceRequest");
const User = require("../models/User");

const getAllRequests = async (req, res, next) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate("user", "name email")
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

const getRequestById = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
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

const assignRequest = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "assignedTo is required",
      });
    }

    const assignedUser = await User.findOne({
      _id: assignedTo,
      role: "ADMIN",
    });

    if (!assignedUser) {
      return res.status(400).json({
        success: false,
        message: "Assigned user must be a valid admin",
      });
    }

    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    request.assignedTo = assignedUser._id;

    if (request.status === "Open") {
      request.status = "In Progress";
    }

    await request.save();

    const updatedRequest = await MaintenanceRequest.findById(request._id)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      message: "Request assigned successfully",
      request: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    if (status === "Resolved" && !request.resolution) {
      return res.status(400).json({
        success: false,
        message: "Resolution details are required before resolving",
      });
    }

    request.status = status;

    if (status === "Resolved") {
      request.resolvedAt = new Date();
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
};

const resolveRequest = async (req, res, next) => {
  try {
    const { resolution } = req.body;

    if (!resolution || resolution.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Valid resolution details are required",
      });
    }

    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    request.resolution = resolution.trim();
    request.status = "Resolved";
    request.resolvedAt = new Date();

    await request.save();

    const updatedRequest = await MaintenanceRequest.findById(request._id)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      message: "Request resolved successfully",
      request: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

const closeRequest = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    if (request.status !== "Resolved") {
      return res.status(400).json({
        success: false,
        message: "Only resolved requests can be closed",
      });
    }

    request.status = "Closed";

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request closed successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  assignRequest,
  updateStatus,
  resolveRequest,
  closeRequest,
};