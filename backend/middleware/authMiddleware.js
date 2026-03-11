const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // 1. Check karo ki headers hain ya nahi
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // 2. Token extract karo
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

      // 4. User info request object mein daal do
      req.user = decoded;
      
      return next(); // 👈 'return' lagana zaroori hai taaki aage ka code na chale
    } catch (error) {
      console.error("Token Verification Error:", error.message);
      return res.status(401).json({ message: "Invalid token, authorization failed" });
    }
  }

  // 5. Agar token nahi mila toh response bhej kar yahi khatam karo
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// 6. --- ADMIN CHECK MIDDLEWARE ---
// Iska use Reports aur User Management mein hoga
const admin = (req, res, next) => {
  // Check karo ki req.user exist karta hai aur uska role admin hai
  // (Ye depend karta hai ki aapne token mein 'role' save kiya hai ya nahi)
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Admins Only" });
  }
};

module.exports = { protect, admin };