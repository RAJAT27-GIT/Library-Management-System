import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/admin/login" : "/admin/signup";
    
    try {
      const res = await API.post(endpoint, { email, password });
      
      // ✅ Token check (Controller format ke hisab se)
      const token = res.data.token;
      const role = res.data.role;

      if (token) {
        // 🔥 Navbar mein 'token' naam se check hai, isliye 'token' hi save karo
        localStorage.setItem("token", token);
        localStorage.setItem("role", role || "admin");
        
        alert(res.data.message || "✅ Success!");

        // 🔥 Page refresh ke sath home (Dashboard) par bhejo taaki Navbar update ho jaye
        window.location.href = "/"; 
      } else {
        alert("❌ Token nahi mila backend se!");
      }
    } catch (err) {
      console.log('ERROR:', err.response?.data);
      alert(err.response?.data?.message || "Server down hai bhai!");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Bhai, pehle email toh daal do!");
      return;
    }
    try {
      const res = await API.post("/user/forgot-password", { email });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Email not found!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <div style={{ display: "inline-block", padding: "30px", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
        <h2>{isLogin ? "Admin Login" : "Admin Signup"}</h2>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Admin Email" 
            value={email}
            required 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ padding: "10px", width: "250px", marginBottom: "15px" }}
          /><br />
          
          <input 
            type="password" 
            placeholder="Password" 
            required 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: "10px", width: "250px", marginBottom: "15px" }}
          /><br />
          
          <button type="submit" style={{ padding: "10px 30px", background: "#333", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: "none", border: "none", color: "blue", cursor: "pointer", textDecoration: "underline", fontSize: "14px" }}
          >
            {isLogin ? "Create New Admin Account? Signup" : "Already a Admin? Login"}
          </button>
          
          <br /><br />

          {isLogin && (
            <button 
              onClick={handleForgotPassword}
              style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "12px" }}
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;