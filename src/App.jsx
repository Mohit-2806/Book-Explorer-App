import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import BookItem from "./BookItem";
import MyLibrary from "./MyLibrary";
import GenrePage from "./GenrePage";
import BookDetails from "./BookDetails";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";

function Home({ books, userBooks, setUserBooks, search }) {
  const grouped = books.reduce((acc, b) => {
    if (!acc[b.genre]) acc[b.genre] = [];
    acc[b.genre].push(b);
    return acc;
  }, {});

  return (
    <div style={home}>
      {search
        ? books
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
            ))
        : Object.keys(grouped).map((g) => (
            <div key={g}>
              <h2 style={h2}>{g}</h2>
              <div style={row}>
                {grouped[g].map((b) => (
                  <BookItem
                    key={b.id}
                    book={b}
                    userBooks={userBooks}
                    setUserBooks={setUserBooks}
                  />
                ))}
              </div>
            </div>
          ))}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [userBooks, setUserBooks] = useState([]);

  const books = [
    { id: "1", title: "Harry Potter", genre: "Fantasy" },
    { id: "2", title: "Atomic Habits", genre: "Self-help" },
    { id: "3", title: "The Hobbit", genre: "Fantasy" }
  ];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!user) return <Auth />;

  const genres = [...new Set(books.map((b) => b.genre))];

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      <Sidebar genres={genres} />

      <div style={main}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                books={books}
                userBooks={userBooks}
                setUserBooks={setUserBooks}
                search={search}
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
      </div>
    </>
  );
}

const main = {
  position: "absolute",              // ✅ key change
  top: "60px",
  left: "220px",
  right: 0,                          // ✅ stretch to right edge
  bottom: 0,                         // ✅ stretch to bottom
  padding: "20px",
  background: "#0B3D4F",
  overflowY: "auto"
};


const home = {
  padding: "20px",
  color: "white"
};

const h2 = {
  color: "#FFD54F"
};

const row = {
  display: "flex",
  gap: "15px"
};

export default App;