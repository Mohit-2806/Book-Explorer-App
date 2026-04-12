import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

function BookItem({ book, userBooks, setUserBooks }) {
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

  const handleAdd = async (status) => {
    const existing = userBooks.find((b) => b.bookId === book.id);

    let progress = existing?.progress || 0;

    if (existing && existing.status === status) {
      await supabase.from("user_books").delete().eq("book_id", book.id);
      setUserBooks(userBooks.filter((b) => b.bookId !== book.id));
      return;
    }

    const updatedBooks = existing
      ? userBooks.map((b) =>
          b.bookId === book.id ? { ...b, status } : b
        )
      : [...userBooks, { bookId: book.id, status, progress: 0 }];

    setUserBooks(updatedBooks);

    // ✅ KEEP EXISTING PROGRESS
    await supabase.from("user_books").upsert({
      book_id: book.id,
      status,
      progress
    });
  };

  const updateProgress = async (change) => {
    const existing = userBooks.find((b) => b.bookId === book.id);
    if (!existing) return;

    const newProgress = Math.max(
      0,
      Math.min(existing.progress + change, 100)
    );

    const newStatus = newProgress >= 100 ? "completed" : "reading";

    // ✅ update UI FIRST (using fresh value)
    const updatedBooks = userBooks.map((b) =>
      b.bookId === book.id
        ? { ...b, progress: newProgress, status: newStatus }
        : b
    );

    setUserBooks(updatedBooks);

    // ✅ THEN sync to Supabase
    const { error } = await supabase
      .from("user_books")
      .update({
        progress: newProgress,
        status: newStatus
      })
      .eq("book_id", book.id);

        if (error) console.log(error);
    };

  const current = userBooks.find((b) => b.bookId === book.id);

  return (
    <div
      onClick={() => navigate(`/book/${book.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.04)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      style={{
        width: "160px",
        flexShrink: 0,
        boxSizing: "border-box",
        padding: "10px",
        borderRadius: "16px",
        background: "#ffffffcc",
        backdropFilter: "blur(6px)",
        border: "1px solid #D7CCC8",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.25s ease",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}
    >
      {/* ✅ COMPLETED BADGE */}
      {current?.status === "completed" && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "#4CAF50",
            color: "white",
            padding: "2px 6px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          ✓ Completed
        </div>
      )}

      <img
        src="https://picsum.photos/150/200"
        alt={book.title}
        style={{
          width: "100%",
          borderRadius: "12px"
        }}
      />

      <p style={{ color: "#4E342E", fontWeight: "600", marginTop: "8px" }}>
        {book.title}
      </p>

      {/* ✅ PROGRESS BAR */}
      {current?.status === "reading" && (
        <div style={{ marginTop: "6px" }}>
          <div
            style={{
              height: "6px",
              width: "100%",
              background: "#D7CCC8",
              borderRadius: "6px",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${current.progress || 0}%`,
                background: "#4CAF50",
                transition: "width 0.3s ease"
              }}
            />
          </div>
        </div>
      )}

      {/* MENU */}
      <div ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#E8F5E9",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            padding: "2px 6px"
          }}
        >
          ⋮
        </button>

        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "10px",
            background: "#ffffffee",
            backdropFilter: "blur(8px)",
            border: "1px solid #D7CCC8",
            borderRadius: "10px",
            padding: "6px",
            transform: showMenu ? "scale(1)" : "scale(0.8)",
            opacity: showMenu ? 1 : 0,
            transformOrigin: "top right",
            transition: "all 0.15s ease",
            pointerEvents: showMenu ? "auto" : "none",
            zIndex: 10
          }}
        >
          {["to-read", "reading", "completed"].map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.stopPropagation();
                handleAdd(s);
              }}
              style={btn}
            >
              {current?.status === s ? "✅ " : ""} {s}
            </button>
          ))}

          {/* ✅ +/- PROGRESS */}
          {current?.status === "reading" && (
            <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateProgress(-10);
                }}
                style={btn}
              >
                -
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateProgress(10);
                }}
                style={btn}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const btn = {
  background: "#4CAF50",
  color: "white",
  border: "none",
  padding: "6px",
  borderRadius: "6px",
  cursor: "pointer",
  flex: 1
};

export default BookItem;