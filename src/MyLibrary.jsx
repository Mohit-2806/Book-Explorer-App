import BookItem from "./BookItem";

function MyLibrary({ userBooks = [], books = [], setUserBooks, user }) {

  const getBooksByStatus = (status) =>
    userBooks
      .filter((ub) => ub.status === status)
      .map((ub) => ({
        ...books.find((b) => b.id === ub.bookId),
        progress: ub.progress
      }))
      .filter(Boolean);

  const toRead = getBooksByStatus("to-read");
  const reading = getBooksByStatus("reading");
  const completed = getBooksByStatus("completed");

  return (
    <div style={container}>
      <h1 style={title}>MY LIBRARY</h1>

      <Section
        title="To Read"
        list={toRead}
        userBooks={userBooks}
        setUserBooks={setUserBooks}
        user={user}
      />

      <Section
        title="Reading"
        list={reading}
        userBooks={userBooks}
        setUserBooks={setUserBooks}
        user={user}
      />

      <Section
        title="Completed"
        list={completed}
        userBooks={userBooks}
        setUserBooks={setUserBooks}
        user={user}
      />
    </div>
  );
}

/* 🔥 CLEAN SECTION */
function Section({ title, list, userBooks, setUserBooks, user }) {
  return (
    <div style={section}>
      <h2 style={sectionTitle}>{title}</h2>

      <div style={row}>
        {list.length === 0 ? (
          <p style={empty}>Nothing here yet</p>
        ) : (
          list.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              userBooks={userBooks}
              setUserBooks={setUserBooks}
              user={user}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* STYLES */

const container = {
  padding: "20px",
  background: "#191A1C",
  minHeight: "100vh",
  fontFamily: "'Montserrat', sans-serif"
};

const title = {
  color: "#FFD54F",
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "32px",
  marginBottom: "20px"
};

const section = {
  marginTop: "30px"
};

const sectionTitle = {
  color: "#F5E6A8",
  fontSize: "13px",
  letterSpacing: "2px",
  textTransform: "uppercase",
  marginBottom: "10px"
};

const row = {
  display: "flex",
  gap: "15px",
  overflowX: "auto",
  paddingBottom: "10px"
};

const empty = {
  color: "#666",
  fontSize: "14px"
};

export default MyLibrary;