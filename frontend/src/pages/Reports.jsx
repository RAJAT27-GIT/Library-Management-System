import { useEffect, useState } from "react";
import API from "../api";

function Reports() {
  const [report, setReport] = useState({
    totalBooks: 0,
    totalUsers: 0,
    issuedBooks: 0,
    totalFine: 0,
    studentData: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await API.get("/reports"); 
        setReport(res.data);
      } catch (err) {
        console.error("Asli Error:", err.response?.data || err.message);
        setError("Reports load nahi ho payi.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  // Membership status check karne ke liye helper
  const getMembershipStatus = (expiryDate) => {
    if (!expiryDate) return { text: "NO PLAN", color: "#7f8c8d" };
    const today = new Date();
    const expiry = new Date(expiryDate);
    return today > expiry 
      ? { text: "EXPIRED", color: "#e74c3c" } 
      : { text: "ACTIVE", color: "#27ae60" };
  };

  if (loading) return <div style={containerStyle}>📊 Generating Admin Reports...</div>;
  if (error) return <div style={containerStyle}>{error}</div>;

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>🏛️ Admin Library Control Panel</h2>

      {/* Overview Cards */}
      <div style={gridStyle}>
        <div style={cardStyle("#3498db")}><h3>Total Books</h3><p style={numberStyle}>{report.totalBooks}</p></div>
        <div style={cardStyle("#2ecc71")}><h3>Total Students</h3><p style={numberStyle}>{report.totalUsers}</p></div>
        <div style={cardStyle("#f1c40f")}><h3>Active Issues</h3><p style={numberStyle}>{report.issuedBooks}</p></div>
        <div style={cardStyle("#e74c3c")}><h3>Total Fine</h3><p style={numberStyle}>₹{report.totalFine}</p></div>
      </div>

      {/* Student Detail Table */}
      <div style={tableContainer}>
        <h3>📋 Student-wise Detailed Report</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#3498db", color: "#fff", textAlign: "left" }}>
              <th style={thStyle}>Student Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Plan</th>
              <th style={thStyle}>Membership Status</th>
              <th style={thStyle}>Books Issued</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {report.studentData.map((student, index) => {
              const mStatus = getMembershipStatus(student.membershipExpiry);
              return (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={tdStyle}>{student.name}</td>
                  <td style={tdStyle}>{student.email}</td>
                  <td style={tdStyle}>{student.membershipType || "Basic"}</td>
                  <td style={{ ...tdStyle, color: mStatus.color, fontWeight: "bold" }}>
                    {mStatus.text}
                  </td>
                  <td style={tdStyle}>{student.booksCount}</td>
                  <td style={{ ...tdStyle, color: student.isOverdue ? "red" : "green", fontWeight: "bold" }}>
                    {student.isOverdue ? "⚠️ OVERDUE" : "✅ CLEAR"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// CSS-in-JS (Style intact as per your code)
const containerStyle = { padding: "40px", backgroundColor: "#f4f7f6", minHeight: "85vh" };
const headerStyle = { color: "#2c3e50", borderLeft: "6px solid #3498db", paddingLeft: "15px", marginBottom: "30px" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "25px" };
const cardStyle = (color) => ({ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", borderTop: `6px solid ${color}`, textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" });
const numberStyle = { fontSize: "32px", fontWeight: "bold", margin: "10px 0" };
const tableContainer = { marginTop: "50px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" };
const thStyle = { padding: "12px" };
const tdStyle = { padding: "12px" };

export default Reports;