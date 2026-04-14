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
    <div
      style={container}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* IMAGE */}
      <div
        style={imageWrap}
        onClick={() => navigate(`/book/${book.id}`)}
      >
        {/* COMPLETED BADGE */}
        {current?.status === "completed" && (
          <div style={badge}>Completed</div>
        )}

        <img
          src={book.thumbnail || "https://via.placeholder.com/150x220"}
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
              transform: showMenu ? "scale(1)" : "translateY(-4px)",
              pointerEvents: showMenu ? "auto" : "none"
            }}
          >
            {["to-read", "reading", "completed"].map((s) => {
              const isActive = current?.status === s;

              return (
                <button
                  key={s}
                  onClick={async (e) => {
                    e.stopPropagation();

                    if (current?.status === s) {
                      const updated = userBooks.filter(
                        (b) => b.bookId !== book.id
                      );
                      setUserBooks(updated);

                      await supabase
                        .from("user_books")
                        .delete()
                        .eq("book_id", book.id);
                    } else {
                      handleAdd(s);
                    }
                  }}
                  style={{
                    ...menuItem,
                    background: isActive ? "#FFD54F" : "transparent",
                    color: isActive ? "#191A1C" : "white",
                    fontWeight: isActive ? "600" : "400"
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
  fontFamily: "'Montserrat', sans-serif",
  transition: "all 0.25s ease",
  borderRadius: "12px"
};

const imageWrap = {
  position: "relative",
  cursor: "pointer"
};

const img = {
  width: "100%",
  borderRadius: "10px"
};

const badge = {
  position: "absolute",
  top: "8px",
  left: "8px",
  background: "#FFD54F",
  color: "#191A1C",
  fontSize: "10px",
  padding: "3px 6px",
  borderRadius: "6px",
  fontWeight: "600",
  zIndex: 5
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
  borderRadius: "6px"
};

export default BookItem;