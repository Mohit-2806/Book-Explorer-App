import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

function BookItem({ book, userBooks, setUserBooks, user }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = userBooks.find((b) => b.bookId === book.id);

  const handleAdd = async (status) => {
    const existing = current;
    let progress = existing?.progress || 0;

    const updated = existing
      ? userBooks.map((b) =>
          b.bookId === book.id ? { ...b, status } : b
        )
      : [...userBooks, { bookId: book.id, status, progress: 0 }];

    setUserBooks(updated);

    await supabase.from("user_books").upsert({
      book_id: book.id,
      status,
      progress,
      user_id: user?.id
    });
  };

  const updateProgress = async (change) => {
    if (!current) return;

    const newProgress = Math.max(
      0,
      Math.min(current.progress + change, 100)
    );

    const newStatus = newProgress === 100 ? "completed" : "reading";

    const updated = userBooks.map((b) =>
      b.bookId === book.id
        ? { ...b, progress: newProgress, status: newStatus }
        : b
    );

    setUserBooks(updated);

    await supabase
      .from("user_books")
      .update({
        progress: newProgress,
        status: newStatus
      })
      .eq("book_id", book.id);
  };

  return (
    <div style={container}>
      {/* IMAGE */}
      <div
        style={imageWrap}
        onClick={() => navigate(`/book/${book.id}`)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <img
          src="https://picsum.photos/150/220"
          alt={book.title}
          style={img}
        />

        {/* MENU */}
        <div ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            style={menuBtn}
          >
            ⋮
          </button>

          <div
            style={{
              ...menu,
              opacity: showMenu ? 1 : 0,
              transform: showMenu ? "scale(1)" : "scale(0.95)",
              pointerEvents: showMenu ? "auto" : "none"
            }}
          >
            {["to-read", "reading", "completed"].map((s) => {
              const isActive = current?.status === s;

              return (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(s);
                  }}
                  style={{
                    ...menuItem,
                    background: isActive ? "#FFD54F" : "transparent",
                    color: isActive ? "#191A1C" : "white",
                    fontWeight: isActive ? "600" : "400",
                    transform: isActive ? "scale(1.05)" : "scale(1)"
                  }}
                >
                  {s}
                </button>
              );
            })}

            {current?.status === "reading" && (
              <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProgress(-10);
                  }}
                  style={menuItem}
                >
                  -
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProgress(10);
                  }}
                  style={menuItem}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TITLE */}
      <p style={title}>{book.title}</p>

      {/* STARS */}
      <div style={stars}>
        {"★".repeat(Math.round(book.rating || 4))}
        {"☆".repeat(5 - Math.round(book.rating || 4))}
      </div>

      {/* PROGRESS */}
      {current?.status === "reading" && (
        <div style={progressWrap}>
          <div style={progressBg}>
            <div
              style={{
                ...progressFill,
                width: `${current.progress || 0}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */

const container = {
  width: "150px",
  fontFamily: "'Montserrat', sans-serif"
};

const imageWrap = {
  position: "relative",
  cursor: "pointer",
  transition: "0.25s ease"
};

const img = {
  width: "100%",
  borderRadius: "10px"
};

const title = {
  marginTop: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#EDEDED"
};

const stars = {
  fontSize: "12px",
  color: "#FFD54F",
  marginTop: "2px"
};

const progressWrap = {
  marginTop: "6px"
};

const progressBg = {
  height: "5px",
  width: "100%",
  background: "#333",
  borderRadius: "5px"
};

const progressFill = {
  height: "100%",
  background: "#FFD54F",
  borderRadius: "5px",
  transition: "width 0.3s ease"
};

const menuBtn = {
  position: "absolute",
  top: "8px",
  right: "8px",
  background: "#191A1C",
  color: "#FFD54F",
  border: "1px solid #FFD54F",
  borderRadius: "6px",
  cursor: "pointer"
};

const menu = {
  position: "absolute",
  top: "35px",
  right: "8px",
  background: "#111",
  border: "1px solid #FFD54F",
  borderRadius: "8px",
  padding: "6px",
  transition: "0.15s ease",
  zIndex: 10
};

const menuItem = {
  background: "transparent",
  color: "white",
  border: "none",
  padding: "6px",
  cursor: "pointer",
  width: "100%",
  textAlign: "left",
  borderRadius: "6px",
  transition: "all 0.15s ease"
};

export default BookItem;