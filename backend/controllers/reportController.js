import Book from "../models/Book.js";
import User from "../models/User.js";
import Issue from "../models/Issue.js";

export const getReports = async (req, res) => {
  const totalBooks = await Book.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalIssues = await Issue.countDocuments();
  const activeIssues = await Issue.countDocuments({ returnDate: null });

  res.json({
    totalBooks,
    totalUsers,
    totalIssues,
    activeIssues,
  });
};
