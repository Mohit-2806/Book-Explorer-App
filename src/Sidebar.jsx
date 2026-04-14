import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ genres }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={sidebar}>
      <p style={heading}>Filter by Genre</p>

      {genres.map((g) => {
        const isActive = location.pathname.includes(g.value);

        return (
          <div
            key={g.value}
            onClick={() => navigate(`/genre/${g.value}`)}
            style={{
              ...item,
              ...(isActive ? activeItem : {})
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "#222";
                e.currentTarget.style.boxShadow =
                  "0 0 10px rgba(255, 213, 79, 0.2)";
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.color = "#aaa";
              }
            }}
          >
            {g.label.charAt(0).toUpperCase() + g.label.slice(1).toLowerCase()} {/* ✅ FIX: use label instead of string */}
          </div>
        );
      })}
    </div>
  );
}

/* STYLES */

const sidebar = {
  position: "fixed",
  top: "70px",
  left: 0,
  width: "180px",
  bottom: 0,
  background: "#191A1C",
  padding: "20px",
  borderRight: "1px solid rgba(255,255,255,0.08)",
  zIndex: 100,
   // ✅ THIS FIXES EVERYTHING
};

const heading = {
  color: "#888",
  fontSize: "12px",
  marginBottom: "15px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  fontFamily: "'Montserrat', sans-serif"
};

const item = {
  padding: "10px 14px",
  borderRadius: "20px",
  color: "#aaa",
  cursor: "pointer",
  fontSize: "17px",
  fontFamily: "'Montserrat', sans-serif",
  transition: "all 0.2s ease",
  marginBottom: "8px"
};

const activeItem = {
  background: "#222",
  color: "#FFD54F",
  boxShadow: "0 0 12px rgba(255, 213, 79, 0.35)"
};

export default Sidebar;