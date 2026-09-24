const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      hostel: {
        type: String,
        required: [true, "Hostel is required"],
        trim: true,
      },

      roomNumber: {
        type: String,
        required: [true, "Room number is required"],
        trim: true,
      },

      area: {
        type: String,
        required: [true, "Area is required"],
        trim: true,
      },
    },

    category: {
      type: String,
      enum: [
        "Electrical",
        "Plumbing",
        "Furniture",
        "Cleaning",
        "Internet",
        "Other",
      ],
      required: [true, "Category is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolution: {
      type: String,
      default: null,
      trim: true,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MaintenanceRequest",
  maintenanceRequestSchema
);