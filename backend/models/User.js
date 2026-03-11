const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, 
  membershipType: { type: String, default: "Basic" },
  membershipExpiry: Date,
  totalFine: { type: Number, default: 0 }
}, { timestamps: true });

// ✅ FIXED PASSWORD HASHING: Modern Async way (No 'next' needed)
userSchema.pre("save", async function () {
  // 1. Agar password change nahi hua, toh kuch mat karo (Mongoose handles the rest)
  if (!this.isModified("password")) return;

  try {
    // 2. Password ko hash karo
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // 💡 Note: Jab function 'async' hota hai, toh return ya completion hi 'next' ka kaam karti hai.
  } catch (error) {
    throw error; // Throwing error will stop the save process
  }
});

// Password match helper method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);