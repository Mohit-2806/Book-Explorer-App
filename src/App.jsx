import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BookItem from "./BookItem";
import MyLibrary from "./MyLibrary";
import GenrePage from "./GenrePage";
import BookDetails from "./BookDetails";
import Auth from "./Auth";
import { supabase } from "./supabaseClient";
import { searchBooks } from "./api";
import BOOKS from "./data/books_flat.json";

/* ---------------- GENRES ---------------- */

const GENRES = [
  { label: "FICTION", value: "fiction" },
  { label: "ROMANCE", value: "romance" },
  { label: "FANTASY", value: "fantasy" },
  { label: "HISTORY", value: "history" },
  { label: "SCIENCE", value: "science" },
  { label: "MYSTERY", value: "mystery" },
  { label: "THRILLER", value: "thriller" },
  { label: "BIOGRAPHY", value: "biography" },
  { label: "ADVENTURE", value: "adventure" },
  { label: "SELF HELP", value: "self-help" },
  { label: "NON FICTION", value: "nonfiction" }
];

/* ---------------- HOME ---------------- */

function Home({ books, userBooks, setUserBooks, search, user, setPage, loadingMore }) {
  const navigate = useNavigate();

  const shuffle = (arr) =>
    arr
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);

  const [shuffledBooks, setShuffledBooks] = useState({});

  useEffect(() => {
    if (!books.length || search) return;

    const grouped = GENRES.reduce((acc, g) => {
      const genreBooks = books.filter((b) => b.genre === g.value);
      acc[g.value] = shuffle(genreBooks).slice(0, 10);
      return acc;
    }, {});

    setShuffledBooks(grouped);
  }, [books]);

  if (!books.length && !search) {
    return <p style={{ color: "#aaa" }}>Loading books...</p>;
  }

  return (
    <div style={home}>
      {search ? (
        <>
          <div style={grid}>
            {books.map((b) => (
              <BookItem
                key={b.id}
                book={b}
                userBooks={userBooks}
                setUserBooks={setUserBooks}
                user={user}
              />
            ))}
          </div>

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
        </>
      ) : (
        GENRES.map((g) => (
          <div key={g.value} style={section}>
            <div style={headerRow}>
              <div style={titleWithArrow}>
                <h2 style={h2}>{g.label}</h2>
                <button
                  style={arrowBtnInline}
                  onClick={() => navigate(`/genre/${g.value}`)}
                >
                  →
                </button>
              </div>
            </div>

            <div style={row}>
              {shuffledBooks[g.value]?.map((b) => (
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
        ))
      )}
    </div>
  );
}

/* ---------------- APP ---------------- */

function App() {
  const [user, setUser] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [userBooks, setUserBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
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

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    setBooks(BOOKS);
    setLoading(false);
  }, []);

  /* ---------------- 🔥 FETCH USER BOOKS (NEW) ---------------- */

  useEffect(() => {
    if (!user) return;

    const fetchUserBooks = async () => {
      const { data, error } = await supabase
        .from("user_books")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.log("fetch user_books error", error);
        return;
      }

      const formatted = data.map((b) => ({
        bookId: b.book_id,
        status: b.status,
        progress: b.progress || 0
      }));

      setUserBooks(formatted);
    };

    fetchUserBooks();
  }, [user]);

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    let isMounted = true;

    const fetchSearch = async () => {
      if (!search.trim()) {
        setPage(1);
        setBooks(BOOKS);
        return;
      }

      let attempts = 0;
      let newResults = [];

      setLoadingMore(true);

      while (attempts < 2 && newResults.length === 0) {
        try {
          const res = await searchBooks(search, page, 7, "search");

          if (res && Array.isArray(res)) {
            newResults = res
              .filter(hasValidImage)
              .filter((b) => !isBlacklisted(b.title))
              .slice(0, 7);
          }
        } catch (e) {
          console.log("search error", e);
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

    fetchSearch();

    return () => {
      isMounted = false;
    };
  }, [search, page]);

  /* ---------------- AUTH ---------------- */

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
  if (loading) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <>
      <Sidebar genres={GENRES} />

      <Navbar
        search={searchInput}
        setSearch={setSearchInput}
        onEnter={() => {
          setPage(1);
          setSearch(searchInput);
        }}
      />

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
                setPage={setPage}
                loadingMore={loadingMore}
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
                user={user}
              />
            }
          />

          <Route
            path="/book/:id"
            element={
              <BookDetails
                userBooks={userBooks}
                setUserBooks={setUserBooks}
                user={user}
              />
            }
          />

          <Route
            path="/genre/:genre"
            element={
              <GenrePage
                userBooks={userBooks}
                setUserBooks={setUserBooks}
                user={user}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const main = {
  position: "fixed",
  top: "70px",
  left: "180px",
  right: 0,
  bottom: 0,
  padding: "25px 30px",
  paddingLeft: "50px",
  overflowY: "auto",
  background: "#191A1C"
};

const home = { padding: "10px" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gap: "20px"
};

const viewMoreBtn = {
  display: "block",
  margin: "0 auto",
  padding: "10px 20px",
  background: "#FFD54F",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const section = {
  marginBottom: "25px",
  paddingBottom: "20px",
  borderBottom: "1px solid #2A2B2E"
};

const headerRow = { display: "flex", alignItems: "center" };

const titleWithArrow = {
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const h2 = {
  color: "#F5E6A8",
  fontSize: "16px",
  letterSpacing: "1px",
  textTransform: "uppercase"
};

const arrowBtnInline = {
  background: "transparent",
  border: "none",
  color: "#FFD54F",
  cursor: "pointer",
  fontSize: "16px"
};

const row = {
  display: "flex",
  gap: "15px",
  overflowX: "auto",
  paddingBottom: "5px"
};

export default App;