import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import BookItem from "./BookItem";
import MyLibrary from "./MyLibrary";
import GenrePage from "./GenrePage";
import BookDetails from "./BookDetails";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { supabase } from "./supabaseClient";

function Home({ books, userBooks, setUserBooks }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const groupedBooks = books.reduce((acc, book) => {
    if (!acc[book.genre]) acc[book.genre] = [];
    acc[book.genre].push(book);
    return acc;
  }, {});

  return (
    <div
      style={{
        background: "#F5F1E6",
        minHeight: "100vh",
        overflowX: "hidden" // ✅ FIX
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
        <h1 style={{ color: "#4E342E" }}>Book Explorer</h1>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #D7CCC8"
          }}
        />

        <button onClick={() => navigate("/my-library")} style={btn}>
          My Library
        </button>

        {search ? (
          <div>
            <h2 style={h2}>Search Results</h2>
            <div style={grid}>
              {books
                .filter((b) =>
                  b.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((b) => (
                  <BookItem
                    key={b.id}
                    book={b}
                    userBooks={userBooks}
                    setUserBooks={setUserBooks}
                  />
                ))}
            </div>
          </div>
        ) : (
          Object.keys(groupedBooks).map((genre) => (
            <div key={genre} style={{ marginBottom: "40px" }}>
              <h2 style={h2}>
                {genre}
                <button
                  onClick={() => navigate(`/genre/${genre}`)}
                  style={btnSmall}
                >
                  ➡️
                </button>
              </h2>

              <div style={row}>
                {groupedBooks[genre].map((b) => (
                  <BookItem
                    key={b.id}
                    book={b}
                    userBooks={userBooks}
                    setUserBooks={setUserBooks}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function App() {
  const [books] = useState([
    { id: "1", title: "Harry Potter", genre: "Fantasy", rating: 4.8 },
    { id: "2", title: "Atomic Habits", genre: "Self-help", rating: 4.7 },
    { id: "3", title: "The Hobbit", genre: "Fantasy", rating: 4.9 }
  ]);

  const [userBooks, setUserBooks] = useState([]);
  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("user_books")
        .select("*");

      if (error) {
        console.log(error);
        return;
      }

      // ✅ FIX: map DB → UI format
      const formatted = (data || []).map((b) => ({
        bookId: b.book_id,
        status: b.status,
        progress: b.progress
      }));

      setUserBooks(formatted);
    };

    fetchBooks();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              books={books}
              userBooks={userBooks}
              setUserBooks={setUserBooks}
            />
          }
        />
        <Route
          path="/my-library"
          element={
            <MyLibrary
              userBooks={userBooks}
              books={books}
              setUserBooks={setUserBooks}
            />
          }
        />
        <Route
          path="/book/:id"
          element={
            <BookDetails
              books={books}
              userBooks={userBooks}
              setUserBooks={setUserBooks}
            />
          }
        />
        <Route
          path="/genre/:genre"
          element={
            <GenrePage
              books={books}
              userBooks={userBooks}
              setUserBooks={setUserBooks}
            />
          }
        />
      </Routes>
    </>
  );
}

const btn = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#4CAF50",
  color: "white",
  cursor: "pointer"
};

const btnSmall = {
  ...btn,
  marginLeft: "10px",
  padding: "6px 10px",
  fontSize: "12px"
};

const h2 = {
  color: "#5D4037",
  marginBottom: "10px"
};

const grid = {
  display: "flex",
  flexWrap: "wrap",
  gap: "15px"
};

const row = {
  display: "flex",
  gap: "15px",
  overflowX: "auto",
  padding: "10px 0",
  scrollBehavior: "smooth",
  scrollbarWidth: "none"
};

export default App;