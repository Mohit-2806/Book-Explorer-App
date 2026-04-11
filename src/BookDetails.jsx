import { useParams } from "react-router-dom";

function BookDetails({ books, userBooks, setUserBooks }) {
  const { id } = useParams();

  const book = books.find((b) => b.id === id);
  if (!book) return <h1>Book not found</h1>;

  const current = userBooks.find((b) => b.bookId === id);

  const handleAdd = (status) => {
    const existing = userBooks.find((b) => b.bookId === id);

    if (existing && existing.status === status) {
      setUserBooks(userBooks.filter((b) => b.bookId !== id));
      return;
    }

    if (existing) {
      setUserBooks(
        userBooks.map((b) =>
          b.bookId === id ? { ...b, status } : b
        )
      );
      return;
    }

    setUserBooks([
      ...userBooks,
      { bookId: id, status, progress: 0 }
    ]);
  };

  return (
    <div style={{ padding: "30px", display: "flex", gap: "40px" }}>
      
      {/* 📕 LEFT SIDE (BIG CARD) */}
      <div>
        <img
          src="https://picsum.photos/250/350"
          alt={book.title}
          style={{
            width: "250px",
            height: "350px",
            objectFit: "cover",
            borderRadius: "15px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)"
          }}
        />
      </div>

      {/* 📘 RIGHT SIDE (DETAILS) */}
      <div>
        <h1>{book.title}</h1>
        <p><b>Genre:</b> {book.genre}</p>
        <p><b>Rating:</b> ⭐ {book.rating || "N/A"}</p>

        <p style={{ marginTop: "15px" }}>
          This is a sample description for the book. You can replace this later
          with real data or API content.
        </p>

        <p style={{ marginTop: "10px" }}>
          <b>Status:</b> {current?.status || "Not added"}
        </p>

        {/* Buttons */}
        <div style={{ marginTop: "20px" }}>
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

        {/* Progress */}
        {current?.status === "reading" && (
          <div style={{ marginTop: "15px" }}>
            <p>Progress: {current.progress}%</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default BookDetails;