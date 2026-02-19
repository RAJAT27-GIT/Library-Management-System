const Book = require("../models/Book");
const User = require("../models/User");
const Issue = require("../models/Issue");

const getReports = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalIssues = await Issue.countDocuments();
    const activeIssues = await Issue.countDocuments({ status: "Issued" });

    res.json({
      totalBooks,
      totalUsers,
      totalIssues,
      activeIssues,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReports };
