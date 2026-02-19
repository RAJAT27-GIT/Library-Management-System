import Issue from "../models/Issue.js";

export const getActiveIssues = async (req, res) => {
  const issues = await Issue.find({ returnDate: null })
    .populate("userId")
    .populate("bookId");

  res.json(issues);
};

export const getOverdueIssues = async (req, res) => {
  const today = new Date();

  const issues = await Issue.find({
    dueDate: { $lt: today },
    returnDate: null,
  })
    .populate("userId")
    .populate("bookId");

  res.json(issues);
};
