import { useParams } from "react-router-dom";
import BookItem from "./BookItem";

function GenrePage({ books = [], userBooks = [], setUserBooks, user }) {
  const { genre } = useParams();

  // ✅ safer filtering (exact match, case insensitive)
  const filteredBooks = books.filter(
    (b) => b.genre.toLowerCase() === genre.toLowerCase()
  );

  return (
    <div style={container}>
      <h1 style={title}>{genre.toUpperCase()}</h1>

      <div style={grid}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              userBooks={userBooks}
              setUserBooks={setUserBooks}
              user={user} // ✅ IMPORTANT
            />
          ))
        ) : (
          <p style={empty}>No books found.</p>
        )}
      </div>
    </div>
  );
}

/* STYLES */

const container = {
  padding: "20px",
  paddingLeft: "50px"
};

const title = {
  color: "#FFD54F",
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "28px",
  marginBottom: "20px"
};

const grid = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px"
};

const empty = {
  color: "#888"
};

export default GenrePage;