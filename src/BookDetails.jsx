import { useParams } from "react-router-dom";

function BookDetails({ books, userBooks }) {
  const { id } = useParams();
  const book = books.find((b) => b.id === id);
  if (!book) return <h1>Not found</h1>;

  const current = userBooks.find((b) => b.bookId === id);

  return (
    <div
      style={{
        background: "#F5F1E6", // full background
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
            border: "3px solid #D7CCC8",
            borderRadius: "15px"
          }}
        />

        {/* RIGHT */}
        <div style={{ color: "#4E342E" }}>
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