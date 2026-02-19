const Issue = require("../models/Issue");

const getActiveIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ status: "Issued" })
      .populate("userId")
      .populate("bookId");

    res.json(issues);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOverdueIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ status: "Issued" })
      .populate("userId")
      .populate("bookId");

    const overdue = issues.filter(issue => {
      const diffDays = Math.floor(
        (new Date() - issue.issueDate) / (1000 * 60 * 60 * 24)
      );
      return diffDays > 7;
    });

    res.json(overdue);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getActiveIssues, getOverdueIssues };
