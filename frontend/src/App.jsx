import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import UpdateBook from "./pages/UpdateBook";
import IssueBook from "./pages/IssueBook";
import ReturnBook from "./pages/ReturnBook";
import ActiveIssues from "./pages/ActiveIssues";
import Overdue from "./pages/Overdue";
import Reports from "./pages/Reports";
import Membership from "./pages/Membership";
import Navbar from "./components/Navbar";
import UserDashboard from "./pages/UserDashboard";

function App() {
  // Check karte hain ki koi user ya admin login hai ya nahi
  const userRole = localStorage.getItem("role");

  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          {/* 🔥 YE HAI FIX: Agar koi sirf "/" par aaye toh use kahan bhejna hai */}
          <Route path="/" element={
            userRole === "admin" ? <Navigate to="/books" /> : 
            userRole === "user" ? <Navigate to="/user-dashboard" /> : 
            <Navigate to="/user-login" />
          } />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/update-book" element={<UpdateBook />} />
          <Route path="/issue" element={<IssueBook />} />
          <Route path="/return" element={<ReturnBook />} />
          <Route path="/active" element={<ActiveIssues />} />
          <Route path="/overdue" element={<Overdue />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />

          {/* Ek extra safety: Agar koi galat URL daale toh login par bhej do */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;