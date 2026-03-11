import { useEffect, useState } from "react";
import API from "../api";

function ActiveIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);

        // LocalStorage se data nikaalna
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const role = localStorage.getItem("role"); 
        const userId = storedUser?._id || localStorage.getItem("userId"); // Dono jagah se check kar liya

        console.log("Current Context:", { role, userId });

        let response;
        if (role === "admin") {
          // ✅ Admin ke liye path sahi kiya (Extra /api hataya agar base URL mein hai)
          response = await API.get("/issue"); 
          setIssues(Array.isArray(response.data) ? response.data : []);
        } else if (role === "user" && userId) {
          // ✅ User ke liye path sahi kiya
          response = await API.get(`/issue/profile/${userId}`); 
          setIssues(response.data.books || []);
        } else {
          setLoading(false);
          return; 
        }

      } catch (err) {
        console.error("API Error:", err);
        setError("Data fetch karne mein dikkat aa rahi hai.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []); 

  if (loading) return <p style={{ textAlign: "center", padding: "20px" }}>⌛ Loading Books...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", padding: "20px" }}>❌ {error}</p>;

  const userRole = localStorage.getItem("role");

  return (
    <div className="issues-container" style={{ padding: "15px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ borderBottom: "2px solid #3498db", paddingBottom: "10px", color: "#2c3e50" }}>
        {userRole === "admin" ? "📋 All Issued Books (Admin)" : "📖 My Borrowed Books"}
      </h2>

      {issues.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#7f8c8d" }}>Abhi koi book issue nahi ki gayi hai.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#3498db", color: "white", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Book Title</th>
                {userRole === "admin" && <th style={{ padding: "12px" }}>Student Name</th>}
                <th style={{ padding: "12px" }}>Issue Date</th>
                <th style={{ padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={issue._id || index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", fontWeight: "500" }}>
                    {issue.bookId?.title || issue.title || "Book Title Missing"}
                  </td>
                  {userRole === "admin" && (
                    <td style={{ padding: "12px" }}>{issue.userId?.name || "Unknown"}</td>
                  )}
                  <td style={{ padding: "12px" }}>
                    {issue.issueDate ? new Date(issue.issueDate).toLocaleDateString('en-GB') : "N/A"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ 
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      backgroundColor: issue.status === "Issued" ? "#fff3e0" : "#e8f5e9",
                      color: issue.status === "Issued" ? "#ef6c00" : "#2e7d32",
                      fontWeight: "bold" 
                    }}>
                      {issue.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ActiveIssues;