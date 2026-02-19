const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const Book = require("../models/Book");
const User = require("../models/User");

//Issue Book
router.post("/", async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.available <= 0) {
      return res.json({ message: "Book Not Available" });
    }

    book.available -= 1;
    await book.save();

    const issue = new Issue({
      userId,
      bookId,
      issueDate: new Date(),
      status: "Issued",   // FIXED
      fine: 0
    });

    await issue.save();
    res.json(issue);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Return Book
router.put("/return/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("bookId");

    if (!issue) return res.json({ message: "Issue Not Found" });

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

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Active Issues
router.get("/active", async (req, res) => {
  try {
    const active = await Issue.find({ status: "Issued" })
      .populate("userId")
      .populate("bookId");

    res.json(active);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Overdue Issues
router.get("/overdue", async (req, res) => {
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

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Report
router.get("/report", async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const issuedBooks = await Issue.countDocuments({ status: "Issued" });

    res.json({ totalBooks, totalUsers, issuedBooks });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
