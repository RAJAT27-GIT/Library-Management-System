const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// 1. Routes Import
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const issueRoutes = require("./routes/issueRoutes");
const reportRoutes = require("./routes/reportRoutes");

dotenv.config();
const app = express();

// 2. GLOBAL MIDDLEWARES
app.use(cors());
app.use(express.json());

// --- DEBUG LOGGING MIDDLEWARE ---
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next(); // Yahan next zaroori hai
});

// 3. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 4. ACTUAL ROUTES
app.use("/api/admin", adminRoutes); 
app.use("/api/user", userRoutes);   
app.use("/api/books", bookRoutes);
app.use("/api/issue", issueRoutes);
app.use("/api/reports", reportRoutes);
// 5. 404 HANDLER
app.use((req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); 
});

// 6. GLOBAL ERROR HANDLER (Mandatory 4 arguments)
app.use((err, req, res, next) => {
  // Agar statusCode pehle se set nahi hai toh 500 use karega
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error("🔥 ERROR FILLED LOG:");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack); // Ye terminal mein line number batayega
  
  res.status(statusCode).json({ 
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack 
  });
});

// 7. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));