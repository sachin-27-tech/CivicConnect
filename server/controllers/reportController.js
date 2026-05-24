const Report = require("../models/Report");

const getImagePath = (file) => {
  return file ? `/uploads/${file.filename}` : "";
};

const createReport = async (req, res, next) => {
  try {
    const { title, description, latitude, longitude, address, category } = req.body;
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (!title || !description || !category || !latitude || !longitude) {
      return res.status(400).json({ message: "Title, description, category, and location are required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an issue photo." });
    }

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
      return res.status(400).json({ message: "Location coordinates must be valid numbers." });
    }

    const report = await Report.create({
      title,
      description,
      image: getImagePath(req.file),
      category,
      location: {
        type: "Point",
        coordinates: [parsedLongitude, parsedLatitude],
        address: address?.trim() || ""
      },
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      createdBy: req.user._id
    });

    const populatedReport = await report.populate("createdBy", "name email role");
    res.status(201).json(populatedReport);
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const reports = await Report.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate("createdBy", "name email role");

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    const ownsReport = report.createdBy._id.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !ownsReport) {
      return res.status(403).json({ message: "You can only view your own report details." });
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};

const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "In Progress", "Resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReportStatus,
};
