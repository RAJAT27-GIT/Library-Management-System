import { useState } from "react";
import API from "../api";

function ReturnBook() {
  const [issueId, setIssueId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Book Return Function (Logic same rakha hai)
  const handleReturn = async () => {
    if (!issueId) return alert("Bhai, pehle Issue ID toh daal do!");
    
    setLoading(true);
    try {
      const res = await API.put(`/issue/return/${issueId.trim()}`);
      setResult(res.data); 
      alert("✅ Book Returned Successfully!");
    } catch (err) {
      console.error("Return Error:", err);
      alert(err.response?.data?.message || "Error returning book!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fine Clear Function (Logic same rakha hai)
  const handleClearFine = async () => {
    try {
      const studentId = result.userId; 
      await API.post(`/user/clear-fine/${studentId}`); 
      alert("💰 Fine Cleared! User Dashboard update ho jayega.");
      setResult({ ...result, fine: 0 }); 
    } catch (err) {
      alert("Fine clear karne mein problem aayi!");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={headerStyle}>🔄 Admin: Return Book</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>Enter the Issue ID to process the book return and calculate fines.</p>

        <div style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Issue ID</label>
            <input 
              style={inputStyle}
              placeholder="Paste Issue ID here..." 
              value={issueId}
              onChange={(e) => setIssueId(e.target.value)} 
            />
          </div>

          <button 
            onClick={handleReturn} 
            disabled={loading}
            style={{...buttonStyle, backgroundColor: loading ? "#ccc" : "#3498db"}}
          >
            {loading ? "Processing..." : "Mark as Returned"}
          </button>
        </div>

        {/* Result Section - Design Improved */}
        {result && (
          <div style={{ 
            marginTop: "30px", 
            padding: "20px", 
            backgroundColor: result.fine > 0 ? "#fff5f5" : "#f0fff4", 
            borderRadius: "8px",
            border: `1px solid ${result.fine > 0 ? "#feb2b2" : "#9ae6b4"}`,
            textAlign: "left"
          }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "#2d3748" }}>Return Summary</h3>
            <p style={{ margin: "5px 0" }}><strong>Status:</strong> <span style={{ color: "#38a169", fontWeight: "bold" }}>{result.status}</span></p>
            
            <div style={{ borderTop: "1px solid #ddd", paddingTop: "10px", marginTop: "10px" }}>
              <p style={{ fontSize: "18px", margin: "10px 0" }}>
                Fine Calculated: <span style={{ color: "#e53e3e", fontWeight: "bold" }}>₹{result.fine}</span>
              </p>
              
              {result.fine > 0 && (
                <button 
                  onClick={handleClearFine}
                  style={{ 
                    ...buttonStyle, 
                    background: "#e53e3e", 
                    fontSize: "14px", 
                    marginTop: "5px",
                    width: "auto",
                    padding: "10px 20px"
                  }}
                >
                  Collect Cash & Clear Fine
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Wahi AddBook wali uniform styling ---
const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", backgroundColor: "#f4f7f6", padding: "20px" };
const formCardStyle = { backgroundColor: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "500px" };
const headerStyle = { margin: "0 0 10px 0", color: "#2c3e50", fontSize: "24px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "5px", textAlign: "left" };
const labelStyle = { fontSize: "14px", fontWeight: "bold", color: "#555" };
const inputStyle = { padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "16px", outline: "none" };
const buttonStyle = { padding: "14px", borderRadius: "6px", border: "none", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", width: "100%" };

export default ReturnBook;