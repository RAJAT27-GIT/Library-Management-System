import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/user-login");
          return;
        }
        const res = await API.get("/issue/profile/" + userId);
        setUserData(res.data);
      } catch (err) {
        console.error("Data error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading Dashboard...</h2>;

  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      <h1>Welcome, {userData?.name || "Student"}! 👋</h1>
      
      <div style={{ display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <h3>Membership</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: calculateDaysLeft(userData?.membershipExpiry) > 0 ? "green" : "red" }}>
            {calculateDaysLeft(userData?.membershipExpiry) > 0 ? "ACTIVE" : "EXPIRED"}
          </p>
          <p>Expires in: {calculateDaysLeft(userData?.membershipExpiry)} days</p>
        </div>

        <div style={cardStyle}>
          <h3>Books History</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold" }}>{userData?.books?.length || 0}</p>
        </div>

        {/* ✅ Total Fine Card - Logic intact */}
       <div style={{ ...cardStyle, borderLeft: "8px solid #ff4d4d"}}>
         <h3 style={{ color: "#cc0000" }}>Total Fine</h3>
         <p style={{ fontSize: "32px", fontWeight: "bold", color: "#d9534f" }}>
         {/* Agar backend se totalFine nahi aa raha, toh hum khud books array se total nikal lenge */}
         ₹{userData?.totalFine || userData?.books?.reduce((acc, book) => acc + (Number(book.fine) || 0), 0) || 0}
         </p>
       </div>
      </div>

      <div style={{ marginTop: "50px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <h2>My Books Status</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
          <thead>
            <tr style={{ backgroundColor: "#333", color: "#fff", textAlign: "left" }}>
              <th style={thStyle}>Book Title</th>
              <th style={thStyle}>Issue Date</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle}>Fine</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {userData?.books && userData.books.length > 0 ? (
              userData.books.map((book, index) => {
                // ✅ Safe Date Parsing
                const issueDateObj = book.issueDate ? new Date(book.issueDate) : null;
                const dueDateObj = book.dueDate ? new Date(book.dueDate) : null;
                
                const isReturned = book.status === "Returned";
                // Agar date aaj se purani hai aur returned nahi hai toh Overdue
                const isOverdue = !isReturned && dueDateObj && dueDateObj < new Date();

                return (
                  <tr key={index} style={{ borderBottom: "1px solid #ddd", backgroundColor: isReturned ? "#f9f9f9" : "transparent" }}>
                    <td style={tdStyle}>{book.title}</td>
                    
                    {/* Display Manual Issue Date */}
                    <td style={tdStyle}>
                      {issueDateObj && !isNaN(issueDateObj.getTime()) 
                        ? issueDateObj.toLocaleDateString('en-GB') // Format: DD/MM/YYYY
                        : "N/A"}
                    </td>
                    
                    {/* ✅ Display Manual Due Date - Fixing "Not Set" issue */}
                    <td style={tdStyle}>
                      {dueDateObj && !isNaN(dueDateObj.getTime()) 
                        ? dueDateObj.toLocaleDateString('en-GB') 
                        : <span style={{color: "orange"}}>Pending Admin</span>}
                    </td>
                    
                    <td style={{ ...tdStyle, color: (book.fine > 0) ? "red" : "black", fontWeight: "bold" }}>
                      ₹{book.fine || 0}
                    </td>

                    <td style={{ 
                      ...tdStyle, 
                      color: isReturned ? "#2196F3" : (isOverdue ? "red" : "green"), 
                      fontWeight: "bold" 
                    }}>
                      {isReturned 
                        ? (book.fine > 0 ? "✅ RETURNED (FINE PAID)" : "✅ RETURNED") 
                        : (isOverdue ? "⚠️ OVERDUE" : "📖 ISSUED")}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Koi record nahi mila.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "10px", flex: "1", minWidth: "250px", borderLeft: "5px solid #333", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" };
const thStyle = { padding: "12px" };
const tdStyle = { padding: "12px" };

export default UserDashboard;