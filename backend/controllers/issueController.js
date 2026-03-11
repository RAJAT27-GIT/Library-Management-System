const Issue = require("../models/Issue");
const User = require("../models/User");
const Book = require("../models/Book"); // 👈 Ye missing tha, populate ke liye zaroori hai

// 1. Get Active Issues (Sabhi issued books ki list)
const getActiveIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ status: "Issued" })
      .populate("userId", "name email") 
      .populate("bookId", "title");     
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Overdue Issues (Wo books jo 7 din se upar ho gayi hain)
const getOverdueIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ status: "Issued" })
      .populate("userId", "name")
      .populate("bookId", "title");

    const overdue = issues.filter(issue => {
      const diffDays = Math.floor((new Date() - new Date(issue.issueDate)) / (1000 * 60 * 60 * 24));
      return diffDays > 7;
    });
    res.json(overdue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Return Book & Calculate Fine (🔥 Super Updated)
const returnBook = async (req, res) => {
  try {
    const { issueId } = req.params; 
    const issue = await Issue.findById(issueId);

    if (!issue) return res.status(404).json({ message: "Issue record nahi mila!" });
    if (issue.status === "Returned") return res.status(400).json({ message: "Book pehle hi return ho chuki hai!" });

    const today = new Date();
    const diffDays = Math.floor((today - new Date(issue.issueDate)) / (1000 * 60 * 60 * 24));
    
    let fineAmount = 0;
    if (diffDays > 7) {
      fineAmount = (diffDays - 7) * 5; // ₹5 per day fine
    }

    // Update Issue Record
    issue.status = "Returned";
    issue.returnDate = today;
    issue.fine = fineAmount;
    await issue.save();

    // Student ka Dashboard update karne ke liye User model mein fine add karo
    if (fineAmount > 0) {
      await User.findByIdAndUpdate(issue.userId, {
        $inc: { totalFine: fineAmount }
      });
    }

    res.json({ 
      message: "Book returned successfully!", 
      fine: fineAmount, 
      status: "Returned",
      userId: issue.userId 
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get User Profile (Isi se Dashboard par books dikhengi)
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User nahi mila" });

    const userBooks = await Issue.find({ userId: id, status: "Issued" })
      .populate("bookId", "title"); 

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      totalFine: user.totalFine || 0,
      membershipExpiry: user.membershipExpiry,
      books: userBooks.map(item => ({
        title: item.bookId ? item.bookId.title : "Book Data Missing",
        issueDate: item.issueDate,
        status: item.status
      }))
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getActiveIssues, getOverdueIssues, returnBook, getUserProfile };