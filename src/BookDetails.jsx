import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function BookDetails({ userBooks = [], setUserBooks, user }) {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  /* ---------------- FETCH BOOK ---------------- */

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );

        const data = await res.json();
        const info = data.volumeInfo || {};

        setBook({
          id: data.id,
          title: info.title,
          authors: info.authors || ["Unknown Author"],
          description: info.description,
          thumbnail: info.imageLinks?.thumbnail,
          rating: info.averageRating || 4
        });
      } catch (e) {
        console.log("book details error", e);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) return <p style={{ color: "white" }}>Loading...</p>;

  const current =
    userBooks?.find((b) => b.bookId === book.id) || null;

  /* ---------------- CLEAN DESCRIPTION ---------------- */

  const cleanDescription = (desc) => {
    if (!desc) return "No description available.";

    return desc
      .replace(/<[^>]*>/g, "")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .trim();
  };

  /* ---------------- STATUS ---------------- */

  const handleStatus = async (status) => {
    let progress = current?.progress || 0;

    const updated = current
      ? userBooks.map((b) =>
          b.bookId === book.id ? { ...b, status } : b
        )
      : [...userBooks, { bookId: book.id, status, progress: 0 }];

    setUserBooks([...updated]); // 🔥 force re-render
    setShowMenu(false);

    try {
      await supabase.from("user_books").upsert({
        book_id: book.id,
        status,
        progress,
        user_id: user?.id
      });
    } catch (e) {
      console.log("status error", e);
    }
  };

  /* ---------------- PROGRESS ---------------- */

  const updateProgress = async (change) => {
    if (!current) return;

    const newProgress = Math.max(
      0,
      Math.min((current.progress || 0) + change, 100)
    );

    const newStatus =
      newProgress === 100 ? "completed" : "reading";

    const updated = userBooks.map((b) =>
      b.bookId === book.id
        ? { ...b, progress: newProgress, status: newStatus }
        : b
    );

    setUserBooks([...updated]); // 🔥 force re-render

    try {
      await supabase
        .from("user_books")
        .update({
          progress: newProgress,
          status: newStatus
        })
        .eq("book_id", book.id)
        .eq("user_id", user?.id); // 🔥 critical fix
    } catch (e) {
      console.log("progress error", e);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={container}>
      {/* LEFT */}
      <div style={left}>
        <div style={imageWrap}>
          <img
            src={
              book.thumbnail ||
              "https://via.placeholder.com/300x400"
            }
            alt={book.title}
            style={img}
          />

          {/* MENU BUTTON */}
          <button
            style={menuBtn}
            onClick={() => setShowMenu((p) => !p)}
          >
            ⋮
          </button>

          {/* DROPDOWN */}
          <div
            style={{
              ...menu,
              opacity: showMenu ? 1 : 0,
              pointerEvents: showMenu ? "auto" : "none"
            }}
          >
            {["to-read", "reading", "completed"].map((s) => {
              const isActive = current?.status === s;

              return (
                <button
                  key={s}
                  onClick={() => handleStatus(s)}
                  style={{
                    ...menuItem,
                    background: isActive
                      ? "#FFD54F"
                      : "transparent",
                    color: isActive
                      ? "#191A1C"
                      : "white"
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={right}>
        <h1 style={title}>{book.title}</h1>

        <p style={author}>{book.authors.join(", ")}</p>

        <div style={stars}>
          {"★".repeat(Math.round(book.rating))}
          {"☆".repeat(5 - Math.round(book.rating))}
        </div>

        {/* STATUS */}
        {current && (
          <p style={status}>
            Status: <span>{current.status}</span>
          </p>
        )}

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

            <div
              style={{
                marginTop: "8px",
                display: "flex",
                gap: "10px"
              }}
            >
              <button
                onClick={() => updateProgress(-10)}
                style={progBtn}
              >
                -
              </button>
              <button
                onClick={() => updateProgress(10)}
                style={progBtn}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* DESCRIPTION */}
        <p style={desc}>
          {cleanDescription(book.description)}
        </p>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const container = {
  display: "flex",
  gap: "50px",
  padding: "40px",
  color: "white"
};

const left = { flex: "0 0 300px" };

const imageWrap = { position: "relative" };

const img = {
  width: "300px",
  borderRadius: "12px"
};

const right = { flex: 1, maxWidth: "800px" };

const title = { fontSize: "30px" };

const author = {
  color: "#aaa",
  marginTop: "5px",
  marginBottom: "10px"
};

const stars = {
  color: "#FFD54F",
  marginBottom: "15px"
};

const status = {
  marginBottom: "15px",
  color: "#FFD54F"
};

const desc = {
  lineHeight: "1.7",
  color: "#ccc"
};

const progressWrap = { marginBottom: "20px" };

const progressBg = {
  height: "6px",
  width: "100%",
  background: "#333",
  borderRadius: "5px"
};

const progressFill = {
  height: "100%",
  background: "#FFD54F",
  borderRadius: "5px"
};

const progBtn = {
  background: "#FFD54F",
  border: "none",
  padding: "4px 10px",
  cursor: "pointer",
  borderRadius: "6px"
};

const menuBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "#191A1C",
  color: "#FFD54F",
  border: "1px solid #FFD54F",
  borderRadius: "6px",
  cursor: "pointer"
};

const menu = {
  position: "absolute",
  top: "40px",
  right: "10px",
  background: "#111",
  border: "1px solid #FFD54F",
  borderRadius: "8px",
  padding: "6px",
  transition: "0.2s"
};

const menuItem = {
  background: "transparent",
  border: "none",
  color: "white",
  padding: "6px",
  cursor: "pointer",
  width: "100%",
  textAlign: "left"
};

export default BookDetails;