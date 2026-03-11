const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Issue = require("../models/Issue");
const Book = require("../models/Book");
const User = require("../models/User");

// 🔥 1. ISSUE A BOOK (Updated: Admin can now set Issue Date & Due Date)
router.post("/", async (req, res) => {
  try {
    // Admin frontend se issueDate, dueDate aur finePerDay bhej sakta hai
    const { userId, bookId, issueDate, dueDate, finePerDay } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid User or Book ID format" });
    }

    const book = await Book.findById(bookId);
    if (!book || book.available <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    // Logic: Agar admin ne issueDate di hai toh wo use karo, warna aaj ki date
    const finalIssueDate = issueDate ? new Date(issueDate) : new Date();
    
    // Logic: Agar admin ne dueDate di hai toh wo use karo, warna issueDate + 7 din
    const finalDueDate = dueDate ? new Date(dueDate) : new Date(finalIssueDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const newIssue = new Issue({
      userId,
      bookId,
      issueDate: finalIssueDate,
      dueDate: finalDueDate, 
      finePerDay: Number(finePerDay) || 0,
      status: "Issued"
    });

    await newIssue.save();

    book.available -= 1;
    await book.save();

    res.status(201).json({ message: "Book Issued Successfully", data: newIssue });
  } catch (err) {
    console.error("Issue Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// 🔥 2. USER PROFILE (Dashboard - No Logic Changes)
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userIssues = await Issue.find({ userId: id })
      .populate("bookId", "title")
      .sort({ issueDate: -1 });

    const formattedIssues = userIssues.map(item => {
      let currentFine = item.fine || 0;

      if (item.status === "Issued" && item.dueDate) {
        const today = new Date();
        const dueDate = new Date(item.dueDate);
        
        if (today > dueDate) {
          const diffTime = Math.abs(today - dueDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          currentFine = diffDays * (item.finePerDay || 0);
        }
      }

      return {
        issueId: item._id, 
        title: item.bookId?.title || "Book Deleted",
        issueDate: item.issueDate,
        dueDate: item.dueDate, 
        status: item.status,
        fine: currentFine, 
        finePerDay: item.finePerDay
      };
    });

    res.json({
      _id: user._id,
      name: user.name,
      membershipExpiry: user.membershipExpiry,
      totalFine: user.totalFine || 0,
      books: formattedIssues
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 3. RETURN A BOOK (No Logic Changes)
router.put("/return/:issueId", async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue record nahi mila!" });

    if (issue.status === "Returned") {
      return res.status(400).json({ message: "Bhai, ye book pehle hi return ho chuki hai!" });
    }

    const today = new Date();
    const dueDate = new Date(issue.dueDate);
    
    let calculatedFine = 0;
    if (issue.dueDate && today > dueDate) {
      const diffTime = Math.abs(today - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      calculatedFine = diffDays * (issue.finePerDay || 0);
    }

    issue.status = "Returned";
    issue.returnDate = today;
    issue.fine = calculatedFine; 
    await issue.save();

    if (calculatedFine > 0) {
      await User.findByIdAndUpdate(issue.userId, { 
        $inc: { totalFine: calculatedFine } 
      });
    }

    const book = await Book.findById(issue.bookId);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.json({ 
      message: "Book Returned Successfully", 
      fine: calculatedFine,
      status: calculatedFine > 0 ? "Returned with Fine" : "Returned"
    });
  } catch (err) {
    console.error("Return Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;