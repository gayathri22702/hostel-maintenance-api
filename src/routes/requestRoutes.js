const express = require("express");

const {
  createRequest,
  getMyRequests,
  getMyRequestById,
  updateRequest,
  cancelRequest,
} = require("../controllers/requestController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createRequest);

router.get("/", getMyRequests);

router.get("/:id", getMyRequestById);

router.put("/:id", updateRequest);

router.delete("/:id", cancelRequest);

module.exports = router;