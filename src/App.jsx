import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BookItem from "./BookItem";
import MyLibrary from "./MyLibrary";
import GenrePage from "./GenrePage";
import BookDetails from "./BookDetails";
import Auth from "./Auth";
import { supabase } from "./supabaseClient";

function Home({ books, userBooks, setUserBooks, search, user }) {
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
                user={user}
              />
            ))
        : Object.keys(grouped).map((g) => (
            <div key={g} style={section}> 
              <h2 style={h2}>{g}</h2>
              <div style={row}>
                {grouped[g].map((b) => (
                  <BookItem
                    key={b.id}
                    book={b}
                    userBooks={userBooks}
                    setUserBooks={setUserBooks}
                    user={user}
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
      <Sidebar genres={genres} />
      <Navbar search={search} setSearch={setSearch} />

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
                user={user}
              />
            }
          />
          <Route
            path="/my-library"
            element={<MyLibrary userBooks={userBooks} books={books} setUserBooks={setUserBooks} user={user}/>}
          />
          <Route
            path="/book/:id"
            element={<BookDetails books={books} books={books} userBooks={userBooks}/>}
          />
          <Route
            path="/genre/:genre"
            element={<GenrePage books={books} />}
          />
        </Routes>
      </div>
    </>
  );
}

const main = {
  position: "absolute",
  top: "65px",
  left: "180px",
  right: 0,
  bottom: 0,
  padding: "25px 30px",
  paddingLeft: "50px", // ✅ gives breathing room
  overflowY: "auto",
  background: "#191A1C",
  zIndex: 1
};


const home = {
  padding: "10px"
};
const section = {
  marginBottom: "25px",
  paddingBottom: "20px",
  borderBottom: "1px solid #2A2B2E" // ✅ clean divider
};

const h2 = {
  color: "#F5E6A8",   // ✅ cream yellow (not harsh yellow)
  marginBottom: "10px",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "18px",
  fontWeight: "400",
  letterSpacing: "1px",
  textTransform: "uppercase"  // ✅ ALL CAPS
};

const row = {
  display: "flex",
  gap: "15px"
};

export default App;