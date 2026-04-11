import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "15px 30px",
        background: "#F5F1E6",
        borderBottom: "1px solid #D7CCC8",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2
        style={{ color: "#4E342E", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        📚 BookApp
      </h2>

      <div>
        <button onClick={() => navigate("/")} style={btn}>
          Home
        </button>

        <button onClick={() => navigate("/my-library")} style={btn}>
          My Library
        </button>
      </div>
    </div>
  );
}

const btn = {
  marginLeft: "10px",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#4CAF50",
  color: "white",
  cursor: "pointer"
};

export default Navbar;