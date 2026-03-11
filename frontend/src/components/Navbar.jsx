import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    // Har bar route change par fresh data uthao
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    
    setToken(storedToken);
    setRole(storedRole);
    
    // Console mein check karne ke liye (Ye line test ke baad hata dena)
    console.log("Current Role:", storedRole); 
  }, [location]);

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    navigate("/admin-login"); // Logout ke baad login pe bhejo
  };

  const linkStyle = { color: "white", marginRight: "15px", textDecoration: "none", fontSize: "14px" };

  return (
    <div style={{ background: "#333", padding: "12px 20px", display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      
      {/* 1. NOT LOGGED IN */}
      {!token && (
        <>
          <Link to="/admin-login" style={linkStyle}>Admin Login</Link>
          <Link to="/user-login" style={linkStyle}>User Login</Link>
        </>
      )}

      {/* 2. ADMIN NAVBAR (Check kar rahe hain ki role 'admin' hi ho) */}
      {token && role === "admin" && (
        <>
          <Link to="/books" style={linkStyle}>Books</Link>
          <Link to="/add-book" style={linkStyle}>Add Book</Link>
          <Link to="/update-book" style={linkStyle}>Update Book</Link>
          <Link to="/issue" style={linkStyle}>Issue</Link>
          <Link to="/return" style={linkStyle}>Return</Link>
          <Link to="/reports" style={linkStyle}>Reports</Link>
          <Link to="/membership" style={linkStyle}>Membership</Link>
          <button onClick={logout} style={{ marginLeft: "auto", cursor: "pointer", background: "#f44336", color: "white", border: "none", padding: "5px 12px", borderRadius: "4px" }}>Logout</button>
        </>
      )}

      {/* 3. USER NAVBAR */}
      {token && role === "user" && (
        <>
          <Link to="/user-dashboard" style={linkStyle}>My Dashboard</Link>
          <Link to="/books" style={linkStyle}>Books</Link>
          <Link to="/active" style={linkStyle}>My Active Books</Link>
          <button onClick={logout} style={{ marginLeft: "auto", cursor: "pointer", background: "#f44336", color: "white", border: "none", padding: "5px 12px", borderRadius: "4px" }}>Logout</button>
        </>
      )}

    </div>
  );
}

export default Navbar;