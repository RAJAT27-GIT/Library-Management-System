import { useState, useEffect } from "react";
import API from "../api";

function Overdue() {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverdue = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setLoading(false);
          return;
        }

        const res = await API.get(`/user/profile/${userId}`); 
        console.log("Full Data:", res.data); // Console check ke liye

        if (res.data && res.data.books) {
          const today = new Date();
          
          // Sabhi "Issued" books dikhao, chahe 7 din hue ho ya nahi (Testing ke liye)
          const filtered = res.data.books.filter(book => {
            return book.status.toLowerCase() === "issued"; 
          });

          setOverdueBooks(filtered);
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchOverdue();
  }, []);

  const tableHeaderStyle = { backgroundColor: "#ff4d4d", color: "white", padding: "12px", textAlign: "left" };
  const cellStyle = { padding: "12px", borderBottom: "1px solid #ddd" };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Checking Data...</h2>;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2 style={{ color: "#d9534f" }}>⚠️ My Issued & Overdue Books</h2>
      
      <div style={{ marginTop: "20px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Book Title</th>
              <th style={tableHeaderStyle}>Issue Date</th>
              <th style={tableHeaderStyle}>Fine Status</th>
            </tr>
          </thead>
          <tbody>
            {overdueBooks.length > 0 ? (
              overdueBooks.map((book, index) => {
                const issueDate = new Date(book.issueDate);
                const diffDays = Math.floor((new Date() - issueDate) / (1000 * 60 * 60 * 24));
                const fine = diffDays > 7 ? (diffDays - 7) * 10 : 0;

                return (
                  <tr key={index}>
                    <td style={cellStyle}>{book.title}</td>
                    <td style={cellStyle}>{issueDate.toLocaleDateString()}</td>
                    <td style={{ ...cellStyle, color: fine > 0 ? "red" : "green", fontWeight: "bold" }}>
                       {fine > 0 ? `₹${fine} (Overdue)` : "No Fine Yet"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                  abhi koi bhi "Issued" book nahi mili. Dashboard check karo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Overdue;