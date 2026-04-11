import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import BookItem from "./BookItem";
import MyLibrary from "./MyLibrary";

function BookDetails() {
  return <h1>Book Details</h1>;
}

function GenrePage() {
  return <h1>Genre Page</h1>;
}

// ✅ HOME
function Home({ books, userBooks, setUserBooks }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const groupedBooks = books.reduce((acc, book) => {
    if (!acc[book.genre]) acc[book.genre] = [];
    acc[book.genre].push(book);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      <h1>Book Explorer</h1>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "10px",
          border: "1px solid #ccc"
        }}
      />

      <button onClick={() => navigate("/my-library")}>
        Go to My Library
      </button>

      {/* SEARCH */}
      {search ? (
        <div>
          <h2>Search Results</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
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
          <div key={genre} style={{ marginBottom: "30px" }}>
            <h2>
              {genre}
              <button onClick={() => navigate(`/genre/${genre}`)}>
                ➡️
              </button>
            </h2>

            <div
              style={{
                display: "flex",
                gap: "15px",
                overflowX: "auto",
                padding: "10px 0"
              }}
            >
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
  );
}

// ✅ APP
function App() {
  const [books] = useState([
    { id: "1", title: "Harry Potter", genre: "Fantasy" },
    { id: "2", title: "Atomic Habits", genre: "Self-help" },
    { id: "3", title: "The Hobbit", genre: "Fantasy" }
  ]);

  const [userBooks, setUserBooks] = useState([]);

  return (
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

      <Route path="/book/:id" element={<BookDetails />} />
      <Route path="/genre/:genre" element={<GenrePage />} />
    </Routes>
  );
}

export default App;