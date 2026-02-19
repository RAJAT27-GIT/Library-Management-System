const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const Book = require("../models/Book");
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { userId, bookId } = req.body;

  const book = await Book.findById(bookId);
  if (book.available <= 0) {
    return res.json({ message: "Book Not Available" });
  }

  book.available -= 1;
  await book.save();

  const issue = new Issue({
    userId,
    bookId,
    issueDate: new Date()
  });

  await issue.save();
  res.json(issue);
});

router.put("/return/:id", async (req, res) => {

  const issue = await Issue.findById(req.params.id).populate("bookId");

  issue.status = "Returned";
  issue.returnDate = new Date();

  const diffDays = Math.floor(
    (new Date() - issue.issueDate) / (1000 * 60 * 60 * 24)
  );

  if (diffDays > 7) {
    issue.fine = (diffDays - 7) * 10;
  }

  issue.bookId.available += 1;
  await issue.bookId.save();
  await issue.save();

  res.json(issue);
});

router.get("/active", async (req, res) => {
  const active = await Issue.find({ status: "Issued" })
    .populate("userId")
    .populate("bookId");

  res.json(active);
});

router.get("/overdue", async (req, res) => {
  const issues = await Issue.find({ status: "Issued" });

  const overdue = issues.filter(issue => {
    const diffDays = Math.floor(
      (new Date() - issue.issueDate) / (1000 * 60 * 60 * 24)
    );
    return diffDays > 7;
  });

  res.json(overdue);
});

router.get("/report", async (req, res) => {
  const totalBooks = await Book.countDocuments();
  const totalUsers = await User.countDocuments();
  const issuedBooks = await Issue.countDocuments({ status: "Issued" });

  res.json({ totalBooks, totalUsers, issuedBooks });
});

module.exports = router;
