const mongoose = require("mongoose"); // 👈 Ye line missing thi, ise add kar diya hai

const issueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true }, 
  finePerDay: { type: Number, default: 0 }, 
  returnDate: { type: Date },
  status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' },
  fine: { type: Number, default: 0 } 
});

module.exports = mongoose.model("Issue", issueSchema);