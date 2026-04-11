import { useState } from "react";

function BookItem({ book, userBooks, setUserBooks }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleAdd = (status) => {
    const existing = userBooks.find((b) => b.bookId === book.id);

    if (existing && existing.status === status) {
      setUserBooks(userBooks.filter((b) => b.bookId !== book.id));
      return;
    }

    if (existing) {
      setUserBooks(
        userBooks.map((b) =>
          b.bookId === book.id ? { ...b, status } : b
        )
      );
      return;
    }

    setUserBooks([
      ...userBooks,
      { bookId: book.id, status, progress: 0 }
    ]);
  };

  const current = userBooks.find((b) => b.bookId === book.id);

  return (
    <div
      style={{
        width: "160px",
        padding: "10px",
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        position: "relative"
      }}
    >
      <img
        src="https://picsum.photos/150/200"
        alt={book.title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "15px"
        }}
      />

      <p style={{ fontWeight: "600" }}>{book.title}</p>

      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          cursor: "pointer"
        }}
      >
        ⋮
      </button>

      {showMenu && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "10px",
            background: "#fff",
            padding: "5px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          <button onClick={() => handleAdd("to-read")}>
            {current?.status === "to-read" ? "✅ " : ""} To Read
          </button>

          <button onClick={() => handleAdd("reading")}>
            {current?.status === "reading" ? "✅ " : ""} Reading
          </button>

          <button onClick={() => handleAdd("completed")}>
            {current?.status === "completed" ? "✅ " : ""} Completed
          </button>
        </div>
      )}
    </div>
  );
}

export default BookItem;