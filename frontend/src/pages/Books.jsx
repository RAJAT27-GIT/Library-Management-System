import { useEffect, useState } from "react";
import API from "../api";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state add kiya

  useEffect(() => {
    // API call with error handling
    API.get("/books")
      .then((res) => {
        setBooks(Array.isArray(res.data) ? res.data : []); // Safe array setting
        setLoading(false);
      })
      .catch((err) => {
        console.error("Books fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: "center", padding: "20px" }}>Loading Books...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{ color: "#2c3e50", borderBottom: "2px solid #3498db", paddingBottom: "10px" }}>
        📚 All Books Library
      </h2>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ backgroundColor: "#3498db", color: "white", textAlign: "left" }}>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Author</th>
            <th style={thStyle}>Available Units</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{book.title}</td>
                <td style={tdStyle}>{book.author}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>{book.available}</td>
                <td style={tdStyle}>
                  {/* Visual Status Check */}
                  <span style={{ 
                    padding: "4px 8px", 
                    borderRadius: "4px", 
                    fontSize: "12px",
                    backgroundColor: book.available > 0 ? "#e8f5e9" : "#ffebee",
                    color: book.available > 0 ? "#2e7d32" : "#c62828",
                    fontWeight: "bold"
                  }}>
                    {book.available > 0 ? "IN STOCK" : "OUT OF STOCK"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No books found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Simple internal styles
const thStyle = { padding: "12px", border: "1px solid #ddd" };
const tdStyle = { padding: "12px", border: "1px solid #ddd" };

export default Books;