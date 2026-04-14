import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 remove default body margin ONLY for this page
  useEffect(() => {
    document.body.style.margin = "0";
  }, []);

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) setMessage(error.message);
    else setMessage("Account created! You can now log in.");
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) setMessage(error.message);
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={logo}>📖 PASSAGE</h1>

        <p style={subtitle}>Login or Sign Up</p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button onClick={handleLogin} style={btnPrimary}>
          Login
        </button>

        <button onClick={handleSignUp} style={btnSecondary}>
          Sign Up
        </button>

        {message && <p style={msg}>{message}</p>}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const container = {
  minHeight: "100vh",   // 🔥 FIX (instead of height)
  width: "100vw",       // 🔥 ensures full width
  background: "#191A1C",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Montserrat', sans-serif"
};

const card = {
  width: "320px",
  padding: "30px",
  borderRadius: "16px",
  background: "#111",
  border: "1px solid #2A2B2E",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const logo = {
  color: "#FFD54F",
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "32px",
  marginBottom: "5px"
};

const subtitle = {
  color: "#aaa",
  fontSize: "14px",
  marginBottom: "20px"
};

const input = {
  width: "100%",
  marginBottom: "12px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #FFD54F",
  background: "#191A1C",
  color: "white",
  outline: "none",
  boxSizing: "border-box"
};

const btnPrimary = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#FFD54F",
  color: "#191A1C",
  cursor: "pointer",
  marginTop: "5px",
  fontWeight: "600"
};

const btnSecondary = {
  ...btnPrimary,
  background: "#FFB300",
  marginTop: "8px"
};

const msg = {
  marginTop: "15px",
  fontSize: "13px",
  color: "#FFD54F",
  textAlign: "center"
};

export default Auth;