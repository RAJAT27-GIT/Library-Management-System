import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import UpdateBook from "./pages/UpdateBook";
import IssueBook from "./pages/IssueBook";
import ReturnBook from "./pages/ReturnBook";
import ActiveIssues from "./pages/ActiveIssues";
import Overdue from "./pages/Overdue";
import Reports from "./pages/Reports";
import Membership from "./pages/Membership";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
