import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{ background: "#333", padding: "10px" }}>
      <Link to="/" style={{ color: "white", marginRight: "10px" }}>Dashboard</Link>
      <Link to="/admin-login" style={{ color: "white", marginRight: "10px" }}>Admin</Link>
      <Link to="/user-login" style={{ color: "white", marginRight: "10px" }}>User</Link>
      <Link to="/books" style={{ color: "white", marginRight: "10px" }}>Books</Link>
      <Link to="/add-book" style={{ color: "white", marginRight: "10px" }}>Add</Link>
      <Link to="/update-book" style={{ color: "white", marginRight: "10px" }}>Update</Link>
      <Link to="/issue" style={{ color: "white", marginRight: "10px" }}>Issue</Link>
      <Link to="/return" style={{ color: "white", marginRight: "10px" }}>Return</Link>
      <Link to="/active" style={{ color: "white", marginRight: "10px" }}>Active</Link>
      <Link to="/overdue" style={{ color: "white", marginRight: "10px" }}>Overdue</Link>
      <Link to="/reports" style={{ color: "white", marginRight: "10px" }}>Reports</Link>
      <Link to="/membership" style={{ color: "white" }}>Membership</Link>
    </div>
  );
}

export default Navbar;
