const express = require("express");
const upload = require("../middleware/upload");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReportStatus,
} = require("../controllers/reportController");

const router = express.Router();

router.post("/", protect, upload.single("image"), createReport);
router.get("/", getReports);
router.get("/my", protect, getMyReports);
router.get("/:id", protect, getReportById);
router.put("/:id/status", protect, authorize("admin"), updateReportStatus);

module.exports = router;
