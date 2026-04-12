import { useNavigate } from "react-router-dom";

function Sidebar({ genres }) {
  const navigate = useNavigate();

  return (
    <div style={sidebar}>
      {genres.map((g) => (
        <div
          key={g}
          onClick={() => navigate(`/genre/${g}`)}
          style={item}
        >
          {g}
        </div>
      ))}
    </div>
  );
}


const sidebar = {
  position: "fixed",
  top: "60px",
  left: 0,
  bottom: 0,                         // ✅ instead of height
  width: "220px",
  background: "#052d3d",
  padding: "20px"
};

const item = {
  color: "white",
  marginBottom: "10px",
  cursor: "pointer"
};

export default Sidebar;