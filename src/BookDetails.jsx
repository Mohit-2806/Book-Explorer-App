import { useParams } from "react-router-dom";

function BookDetails({ books, userBooks }) {
  const { id } = useParams();
  const book = books.find((b) => b.id === id);
  if (!book) return <h1>Not found</h1>;

  const current = userBooks.find((b) => b.bookId === id);

  return (
    <div
      style={{
        background: "#0B3D4F", // full background
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          padding: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
          marginTop: "10px",
          display: "flex",
          gap: "40px",
          fontFamily: "sans-serif"
        }}
      >
        {/* LEFT */}
        <img
          src="https://picsum.photos/250/350"
          alt={book.title}
          style={{
            border: "3px solid #FFD54F",
            borderRadius: "15px"
          }}
        />

        {/* RIGHT */}
        <div style={{ color: "#FFD54F" }}>
          <h1>{book.title}</h1>
          <p><b>Genre:</b> {book.genre}</p>
          <p><b>Rating:</b> ⭐ {book.rating}</p>
          <p><b>Status:</b> {current?.status || "None"}</p>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;