import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

function Navbar({ search, setSearch, onEnter}) {
  const navigate = useNavigate();

  return (
    <div style={nav}>
      {/* LEFT: LOGO */}
      <div onClick={() => navigate("/")} style={logo}>
        📖 PASSAGE
      </div>

      {/* CENTER: NAV LINKS */}
      <div style={navLinks}>
        <span style={navItem}>Browse</span>
        <span style={navItem}>New Arrivals</span>
        <span style={navItem}>Bestsellers</span>
        <span style={navItem}>About</span>
      </div>

      {/* SEARCH (CENTER-RIGHT) */}
      
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();   // 🔥 important
            onEnter && onEnter(); // 🔥 safe call
          }
        }}
        style={searchStyle}
      />

      {/* RIGHT */}
      <div style={right}>
        <button onClick={() => navigate("/my-library")} style={btn}>
          My Library
        </button>
        <button onClick={() => supabase.auth.signOut()} style={btn2}>
          Logout
        </button>
      </div>
    </div>
  );
}

const nav = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "70px",
  display: "flex",
  alignItems: "center",
  padding: "0 30px",
  background: "#191A1C",
  borderBottom: "1px solid #2A2B2E",
  zIndex: 1000
};

const logo = {
  color: "#FFD54F",
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "28px",
  fontWeight: "600",
  marginRight: "40px",
  cursor: "pointer"
};

const navLinks = {
  display: "flex",
  gap: "40px",
  marginRight: "auto" // ✅ pushes rest to right
};

const navItem = {
  color: "#ccc",
  fontSize: "16px",
  fontFamily: "'Montserrat', sans-serif",
  cursor: "pointer"
};

const searchStyle = {
  width: "400px",
  padding: "10px",
  marginRight: "20px",
  borderRadius: "8px",
  border: "1px solid #FFD54F",
  background: "#111",
  color: "white",
  outline: "none",
  fontFamily: "'Montserrat', sans-serif"
};

const right = {
  display: "flex",
  gap: "10px"
};

const btn = {
  background: "#FFD54F",
  color: "#191A1C",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontFamily: "'Montserrat', sans-serif"
};

const btn2 = {
  ...btn,
  background: "#FFB300"
};

export default Navbar;