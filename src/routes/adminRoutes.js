const express = require("express");

const {
  getAllRequests,
  getRequestById,
  assignRequest,
  updateStatus,
  resolveRequest,
  closeRequest,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize("ADMIN"));

router.get("/requests", getAllRequests);
router.get("/requests/:id", getRequestById);

router.patch("/requests/:id/assign", assignRequest);
router.patch("/requests/:id/status", updateStatus);
router.patch("/requests/:id/resolve", resolveRequest);
router.patch("/requests/:id/close", closeRequest);

module.exports = router;