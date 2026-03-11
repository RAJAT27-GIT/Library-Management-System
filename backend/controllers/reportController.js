const Book = require("../models/Book");
const User = require("../models/User");
const Issue = require("../models/Issue");

const getReports = async (req, res) => {
  try {
    console.log("Admin Report Request Received");

    // 1. Top Cards ka data
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });
    
    const issuedBooks = await Issue.countDocuments({ status: "Issued" });

    // 2. Library ka total fine
    const users = await User.find({ isAdmin: false });
    const totalFine = users.reduce((sum, user) => sum + (user.totalFine || 0), 0);

    // 3. STUDENT-WISE REPORT (Admin Table ke liye)
    const studentData = await Promise.all(
      users.map(async (user) => {
        // Is student ne kitni books abhi pakdi hui hain
        const activeIssues = await Issue.countDocuments({ 
          userId: user._id, 
          status: "Issued" 
        });

        const overdueCount = await Issue.countDocuments({
          userId: user._id,
          status: "Issued",
          dueDate: { $lt: new Date() } 
        });

        // TERE LOGIC MEIN MEMBERSHIP DATA ADD KIYA HAI
        return {
          name: user.name,
          email: user.email,
          booksCount: activeIssues,
          fine: user.totalFine || 0,
          isOverdue: overdueCount > 0,
          // Nayi fields jo frontend ko chahiye:
          membershipType: user.membershipType, 
          membershipExpiry: user.membershipExpiry 
        };
      })
    );

    // Final Response
    res.json({
      totalBooks,
      totalUsers,
      issuedBooks,
      totalFine,
      studentData 
    });

  } catch (error) {
    console.error("Report Controller Error Details:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Server Error: " + error.message 
    });
  }
};

module.exports = { getReports };