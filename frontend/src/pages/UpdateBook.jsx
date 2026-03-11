import { useState } from "react";
import API from "../api";

function UpdateBook() {
  const [id, setId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await API.put(`/books/${id}`, {
        quantity,
        available: quantity
      });
      alert("Book Updated Successfully");
      // Form reset
      setId("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert("Error updating book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={headerStyle}>🔄 Update Book Quantity</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>Update stock details using Book ID.</p>

        <div style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Book ID</label>
            <input 
              style={inputStyle} 
              placeholder="Enter Book ID" 
              value={id}
              onChange={(e) => setId(e.target.value)} 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>New Quantity</label>
            <input 
              type="number" 
              style={inputStyle} 
              placeholder="Enter new quantity" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)} 
            />
          </div>

          <button 
            onClick={handleUpdate}
            disabled={loading}
            style={{...buttonStyle, backgroundColor: loading ? "#ccc" : "#3498db"}}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Wahi AddBook wali styling ---
const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", backgroundColor: "#f4f7f6", padding: "20px" };
const formCardStyle = { backgroundColor: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "500px" };
const headerStyle = { margin: "0 0 10px 0", color: "#2c3e50", fontSize: "24px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "5px" };
const labelStyle = { fontSize: "14px", fontWeight: "bold", color: "#555" };
const inputStyle = { padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "16px", outline: "none" };
const buttonStyle = { padding: "14px", borderRadius: "6px", border: "none", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" };

export default UpdateBook;