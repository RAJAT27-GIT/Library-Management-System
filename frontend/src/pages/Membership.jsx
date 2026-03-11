import { useState } from "react";
import API from "../api";

function Membership() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [membershipType, setMembershipType] = useState("");
  const [expiry, setExpiry] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!membershipType) return alert("Bhai, Membership Type toh select kar lo!");

    setLoading(true);
    try {
      await API.post("/user/signup", {
        name,
        email,
        membershipType,
        membershipExpiry: expiry,
      });

      alert("Membership Added Successfully 🎉");
      setName("");
      setEmail("");
      setMembershipType("");
      setExpiry("");
    } catch (error) {
      alert(error.response?.data?.message || "Kuch error aa gaya!");
    } finally {
      setLoading(false);
    }
  };

  // --- AAPKE DIYE GAYE COLORS AUR UI STYLES ---
  const styles = {
    container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh", backgroundColor: "#f4f7f6", padding: "20px", fontFamily: "inherit" },
    formCard: { backgroundColor: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "500px" },
    header: { margin: "0 0 10px 0", color: "#2c3e50", fontSize: "24px", textAlign: "center", fontWeight: "bold" },
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "5px", textAlign: "left" },
    label: { fontSize: "14px", fontWeight: "bold", color: "#555" },
    input: { padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box" },
    button: { 
        padding: "14px", 
        borderRadius: "6px", 
        border: "none", 
        backgroundColor: loading ? "#ccc" : "#3498db    ", // Aapka primary dark color
        color: "#fff", 
        fontSize: "16px", 
        fontWeight: "bold", 
        cursor: loading ? "not-allowed" : "pointer", 
        marginTop: "10px", 
        transition: "0.3s" 
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.header}>Add Membership</h2>
        <p style={{ textAlign: "center", color: "#777", marginBottom: "20px", fontSize: "14px" }}>
          Fill in the details to register a new member plan.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Student Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Student Name</label>
            <input
              style={styles.input}
              placeholder="Enter Full Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Address */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="student@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Membership Plan Dropdown */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Membership Plan</label>
            <select
              style={styles.input}
              value={membershipType}
              required
              onChange={(e) => setMembershipType(e.target.value)}
            >
              <option value="" disabled>Select Type</option>
              <option value="Basic">Basic (1 Month)</option>
              <option value="Premium">Premium (6 Months)</option>
              <option value="Elite">Elite (1 Year)</option>
            </select>
          </div>

          {/* Expiry Date */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Expiry Date</label>
            <input
              style={styles.input}
              type="date"
              value={expiry}
              required
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Adding..." : "Confirm Membership"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Membership;