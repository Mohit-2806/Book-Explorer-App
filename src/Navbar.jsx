import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();

  return (
    <div style={nav}>
      <div onClick={() => navigate("/")} style={logo}>
        📖 Passage
      </div>

      <input
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

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
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 20px",
  background: "#052d3d",
  zIndex: 1000
};

const logo = {
  color: "#FFD54F",
  fontWeight: "bold",
  cursor: "pointer"
};

const searchStyle = {
  width: "40%",
  padding: "8px",
  borderRadius: "8px",
  border: "none",
  outline: "none"
};

const right = {
  display: "flex",
  gap: "10px"
};

const btn = {
  background: "#FFD54F",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const btn2 = {
  ...btn,
  background: "#FFB300"
};

export default Navbar;