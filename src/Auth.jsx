import { useState } from "react";
import { supabase } from "./supabaseClient";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) alert(error.message);
    else alert("Account created! You can now log in.");
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) alert(error.message);
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#F5F1E6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif"
      }}
    >
      <div
        style={{
          width: "300px",
          padding: "25px",
          borderRadius: "16px",
          background: "#ffffffcc",
          backdropFilter: "blur(8px)",
          border: "1px solid #D7CCC8",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h2 style={{ textAlign: "center", color: "#4E342E" }}>
          Book Explorer
        </h2>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#6D4C41" }}>
          Login or Sign Up
        </p>

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

        <button onClick={handleLogin} style={btn}>
          Login
        </button>

        <button onClick={handleSignUp} style={btnSecondary}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

const input = {
  width: "100%",
  marginBottom: "12px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #D7CCC8",
  outline: "none",
  boxSizing: "border-box" // ✅ THIS FIXES CENTERING
};

const btn = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#4CAF50",
  color: "white",
  cursor: "pointer",
  marginBottom: "8px",
  fontWeight: "600"
};

const btnSecondary = {
  ...btn,
  background: "#A5D6A7",
  color: "#1B5E20"
};

export default Auth;