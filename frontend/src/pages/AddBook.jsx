import { useState } from "react";
import API from "../api";

function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/books", {
        title,
        author,
        category,
        quantity,
        available: quantity,
      });

      alert("🎉 Book Added Successfully!");
      // Form reset karne ke liye
      setTitle("");
      setAuthor("");
      setCategory("");
      setQuantity("");
      e.target.reset(); 
    } catch (err) {
      console.error(err);
      alert("❌ Error adding book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={headerStyle}>📚 Add New Book</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>Enter book details to update library inventory.</p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Book Title</label>
            <input 
              style={inputStyle} 
              placeholder="e.g. The Alchemist" 
              value={title}
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Author Name</label>
            <input 
              style={inputStyle} 
              placeholder="e.g. Paulo Coelho" 
              value={author}
              onChange={(e) => setAuthor(e.target.value)} 
              required 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Category</label>
            <input 
              style={inputStyle} 
              placeholder="Fiction, Science, History..." 
              value={category}
              onChange={(e) => setCategory(e.target.value)} 
              required 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Total Quantity</label>
            <input 
              type="number" 
              style={inputStyle} 
              placeholder="Number of copies" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{...buttonStyle, backgroundColor: loading ? "#ccc" : "#3498db"}}
          >
            {loading ? "Adding..." : "Add to Library"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Styles (CSS-in-JS) ---
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
  backgroundColor: "#f4f7f6",
  padding: "20px"
};

const formCardStyle = {
  backgroundColor: "#fff",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "500px"
};

const headerStyle = {
  margin: "0 0 10px 0",
  color: "#2c3e50",
  fontSize: "24px"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "5px"
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#555"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "16px",
  outline: "none",
  transition: "border 0.3s",
};

const buttonStyle = {
  padding: "14px",
  borderRadius: "6px",
  border: "none",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
  transition: "transform 0.2s"
};

export default AddBook;