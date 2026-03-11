import { useState } from "react";
import API from "../api";

function UserLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  const endpoint = isLogin ? "/user/login" : "/user/signup";
  const payload = isLogin ? { email, password } : { name, email, password };
  
  try {
    const res = await API.post(endpoint, payload);
    alert(res.data.message);
    
    // Agar token mila hai, matlab login/signup success hai
    if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "user");

        // 🔥 SAFETY CHECK: Agar data.user ke andar _id hai tabhi save karo
        if (res.data.user && res.data.user._id) {
            localStorage.setItem("userId", res.data.user._id);
        } else if (res.data.data && res.data.data._id) {
            // Backup check agar backend 'data' bhej raha ho
            localStorage.setItem("userId", res.data.data._id);
        }

        window.location.href = "/"; // Dashboard par bhejo
    }
  } catch (err) {
    alert(err.response?.data?.message || "Error occurred");
  }
};

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Bhai, pehle apna email id likho!");
      return;
    }
    try {
      const res = await API.post("/user/forgot-password", { email });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  // Reusable styles to match Admin Login
  const inputStyle = { padding: "10px", width: "250px", marginBottom: "15px" };
  const buttonStyle = { padding: "10px 30px", background: "#333", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <div style={{ display: "inline-block", padding: "30px", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
        <h2>{isLogin ? "User Login" : "User Signup"}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                onChange={(e) => setName(e.target.value)} 
                style={inputStyle}
              /><br />
            </>
          )}
          
          <input 
            type="email" 
            placeholder="User Email" 
            value={email}
            required 
            onChange={(e) => setEmail(e.target.value)} 
            style={inputStyle}
          /><br />
          
          <input 
            type="password" 
            placeholder="Password" 
            required 
            onChange={(e) => setPassword(e.target.value)} 
            style={inputStyle}
          /><br />
          
          <button type="submit" style={buttonStyle}>
            {isLogin ? "Login" : "Register as Member"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: "none", border: "none", color: "blue", cursor: "pointer", textDecoration: "underline", fontSize: "14px" }}
          >
            {isLogin ? "Create New Member Account" : "Already a member? Login"}
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

export default UserLogin;