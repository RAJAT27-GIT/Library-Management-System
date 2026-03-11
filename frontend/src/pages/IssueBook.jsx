import { useState } from "react";

function IssueBook() {
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [issueDate, setIssueDate] = useState(""); 
  const [dueDate, setDueDate] = useState("");
  const [finePerDay, setFinePerDay] = useState(10); 
  const [loading, setLoading] = useState(false);

  const handleIssue = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: userId.trim(), 
          bookId: bookId.trim(),
          issueDate: issueDate, 
          dueDate: dueDate, 
          finePerDay: finePerDay 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Book Issued!");
        setUserId("");
        setBookId("");
        setIssueDate(""); 
        setDueDate("");   
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (err) {
      alert("🚀 Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={headerStyle}>📖 Admin: Issue Book</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>Assign a book to a student with due date and fine details.</p>

        <form onSubmit={handleIssue} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>User ID</label>
            <input 
              type="text" 
              style={inputStyle} 
              placeholder="Enter Student ID" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Book ID</label>
            <input 
              type="text" 
              style={inputStyle} 
              placeholder="Enter Book ID" 
              value={bookId} 
              onChange={(e) => setBookId(e.target.value)} 
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Issue Date (Book kab di?)</label>
            <input 
              type="date" 
              style={inputStyle} 
              value={issueDate} 
              onChange={(e) => setIssueDate(e.target.value)} 
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Return Due Date (Last Date)</label>
            <input 
              type="date" 
              style={inputStyle} 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Late Fine Per Day (₹)</label>
            <input 
              type="number" 
              style={inputStyle} 
              value={finePerDay} 
              onChange={(e) => setFinePerDay(e.target.value)} 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{...buttonStyle, backgroundColor: loading ? "#ccc" : "#3498db"}}
          >
            {loading ? "Issuing..." : "Confirm Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Wahi AddBook wali styling ---
const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh", backgroundColor: "#f4f7f6", padding: "20px" };
const formCardStyle = { backgroundColor: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "500px" };
const headerStyle = { margin: "0 0 10px 0", color: "#2c3e50", fontSize: "24px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "5px" };
const labelStyle = { fontSize: "14px", fontWeight: "bold", color: "#555" };
const inputStyle = { padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "16px", outline: "none" };
const buttonStyle = { padding: "14px", borderRadius: "6px", border: "none", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", transition: "0.3s" };

export default IssueBook;