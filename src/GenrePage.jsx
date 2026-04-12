import { useParams } from "react-router-dom";
import BookItem from "./BookItem";

function GenrePage({ books, userBooks, setUserBooks }) {
  const { genre } = useParams();

  const filteredBooks = books.filter((b) =>
    b.genre.toLowerCase().includes(genre.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#0B3D4F", // ✅ full-page cream
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          padding: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
          marginTop: "10px",
          fontFamily: "sans-serif"
        }}
      >
        <h1 style={{ color: "#FFD54F", marginBottom: "20px" }}>
          {genre} Books
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px"
          }}
        >
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookItem
                key={book.id}
                book={book}
                userBooks={userBooks}
                setUserBooks={setUserBooks}
              />
            ))
          ) : (
            <p style={{ color: "#FFD54F" }}>
              No books found in this genre.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenrePage;