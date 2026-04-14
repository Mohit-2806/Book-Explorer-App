import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BookItem from "./BookItem";
import { searchBooks } from "./api";

function GenrePage({ userBooks = [], setUserBooks, user }) {
  const { genre } = useParams();

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const hasValidImage = (b) =>
    b.thumbnail &&
    b.thumbnail.includes("http") &&
    !b.thumbnail.includes("undefined");

  const isBlacklisted = (title) => {
    if (!title) return false;
    const t = title.toLowerCase();
    return t.includes("white fang") || t.includes("vanity fair");
  };

  useEffect(() => {
    let isMounted = true;

    const fetchGenre = async () => {
      let attempts = 0;
      let newResults = [];

      setLoadingMore(true);

      while (attempts < 2 && newResults.length === 0) {
        try {
          const res = await searchBooks(genre, page, 14, "genre");

          if (res && Array.isArray(res)) {
            newResults = res
              .filter(hasValidImage)
              .filter((b) => !isBlacklisted(b.title))
              .slice(0, 14);
          }
        } catch (e) {
          console.log("genre error", e);
        }

        attempts++;

        if (newResults.length === 0) {
          await new Promise((res) => setTimeout(res, 300));
        }
      }

      setLoadingMore(false);

      if (!isMounted) return;

      if (page === 1) setBooks(newResults);
      else setBooks((prev) => [...prev, ...newResults]);
    };

    fetchGenre();

    return () => {
      isMounted = false;
    };
  }, [genre, page]);

  return (
    <div style={container}>
      <h1 style={title}>{genre.toUpperCase()}</h1>

      <div style={grid}>
        {books.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            userBooks={userBooks}
            setUserBooks={setUserBooks}
            user={user}
          />
        ))}
      </div>

      {/* 🔥 SAME UX AS SEARCH */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          style={viewMoreBtn}
          onClick={() => setPage((p) => p + 1)}
        >
          View More
        </button>

        {loadingMore && (
          <p style={{ color: "#aaa", marginTop: "10px" }}>
            Loading...
          </p>
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
  fontSize: "28px",
  marginBottom: "20px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "20px"
};

const viewMoreBtn = {
  margin: "0 auto",
  padding: "10px 20px",
  background: "#FFD54F",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  display: "block"
};

export default GenrePage;