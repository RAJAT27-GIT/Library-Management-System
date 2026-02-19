const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  issueDate: Date,
  returnDate: Date,
  fine: { type: Number, default: 0 },
  status: { type: String, default: "Issued" }
});

module.exports = mongoose.model("Issue", issueSchema);
