const Report = require("../models/Report");

const getStats = async (req, res, next) => {
  try {
    const [totalReports, pendingReports, inProgressReports, resolvedReports] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: "Pending" }),
      Report.countDocuments({ status: "In Progress" }),
      Report.countDocuments({ status: "Resolved" })
    ]);

    res.json({
      totalReports,
      pendingReports,
      inProgressReports,
      resolvedReports
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
