import BookItem from "./BookItem";

function MyLibrary({ userBooks = [], books = [], setUserBooks }) {

  const handleAdd = (bookId, status) => {
    const existing = userBooks.find(b => b.bookId === bookId);

    if (existing && existing.status === status) {
      setUserBooks(userBooks.filter(b => b.bookId !== bookId));
      return;
    }

    if (existing) {
      setUserBooks(
        userBooks.map(b =>
          b.bookId === bookId ? { ...b, status } : b
        )
      );
      return;
    }

    setUserBooks([
      ...userBooks,
      { bookId, status, progress: 0 }
    ]);
  };

  const increaseProgress = (bookId) => {
    setUserBooks(
      userBooks.map(ub => {
        if (ub.bookId !== bookId) return ub;

        const newProgress = Math.min(ub.progress + 10, 100);

        return {
          ...ub,
          progress: newProgress,
          status: newProgress === 100 ? "completed" : ub.status
        };
      })
    );
  };

  const toReadBooks = userBooks.filter(ub => ub.status === "to-read");
  const readingBooks = userBooks.filter(ub => ub.status === "reading");
  const completedBooks = userBooks.filter(ub => ub.status === "completed");

  return (
    <div style={{ background: "#0B3D4F", minHeight: "100vh" }}>
      <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", marginTop: "10px" }}>

        <h1 style={{ color: "#FFD54F" }}>My Library</h1>

        {/* 📚 To Read */}
        <h2 style={{ color: "#FFD54F", marginTop: "20px" }}>📚 To Read</h2>
        <div style={row}>
          {toReadBooks.map((ub) => {
            const book = books.find(b => b.id === ub.bookId);
            if (!book) return null;

            return (
              <BookItem
                key={ub.bookId}
                book={book}
                userBooks={userBooks}
                setUserBooks={setUserBooks}
              />
            );
          })}
        </div>

        {/* 📖 Reading */}
        <h2 style={{ color: "#FFD54F", marginTop: "20px" }}>📖 Reading</h2>
        <div style={row}>
          {readingBooks.map((ub) => {
            const book = books.find(b => b.id === ub.bookId);
            if (!book) return null;

            return (
              <div key={ub.bookId}>
                <BookItem
                  book={book}
                  userBooks={userBooks}
                  setUserBooks={setUserBooks}
                />
                <p style={{ color: "#FFD54F" }}>Progress: {ub.progress}%</p>
              </div>
            );
          })}
        </div>

        {/* ✅ Completed */}
        <h2 style={{ color: "#FFD54F", marginTop: "20px" }}>✅ Completed</h2>
        <div style={row}>
          {completedBooks.map((ub) => {
            const book = books.find(b => b.id === ub.bookId);
            if (!book) return null;

            return (
              <BookItem
                key={ub.bookId}
                book={book}
                userBooks={userBooks}
                setUserBooks={setUserBooks}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}

const row = {
  display: "flex",
  gap: "15px",
  overflowX: "auto",
  padding: "10px 0"
};

export default MyLibrary;