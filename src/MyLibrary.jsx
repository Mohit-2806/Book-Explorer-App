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
    <div style={{ padding: "20px" }}>
      <h1>My Library</h1>

      {/* 📚 To Read */}
      <h2>📚 To Read</h2>
      <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px 0" }}>
        {toReadBooks.map((ub) => {
          const book = books.find(b => b.id === ub.bookId);
          if (!book) return null;

          return (
            <div key={ub.bookId}>
              <BookItem
                book={book}
                userBooks={userBooks}
                setUserBooks={setUserBooks}
              />

              <button onClick={() => handleAdd(ub.bookId, "to-read")}>
                {ub.status === "to-read" ? "✅ " : ""} To Read
              </button>

              <button onClick={() => handleAdd(ub.bookId, "reading")}>
                {ub.status === "reading" ? "✅ " : ""} Reading
              </button>

              <button onClick={() => handleAdd(ub.bookId, "completed")}>
                {ub.status === "completed" ? "✅ " : ""} Completed
              </button>
            </div>
          );
        })}
      </div>

      {/* 📖 Reading */}
      <h2>📖 Reading</h2>
      <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px 0" }}>
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

              <p>Progress: {ub.progress}%</p>

              <button onClick={() => handleAdd(ub.bookId, "to-read")}>
                To Read
              </button>

              <button onClick={() => handleAdd(ub.bookId, "reading")}>
                {ub.status === "reading" ? "✅ " : ""} Reading
              </button>

              <button onClick={() => handleAdd(ub.bookId, "completed")}>
                Completed
              </button>

              <button onClick={() => increaseProgress(ub.bookId)}>
                +10%
              </button>
            </div>
          );
        })}
      </div>

      {/* ✅ Completed */}
      <h2>✅ Completed</h2>
      <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px 0" }}>
        {completedBooks.map((ub) => {
          const book = books.find(b => b.id === ub.bookId);
          if (!book) return null;

          return (
            <div key={ub.bookId}>
              <BookItem
                book={book}
                userBooks={userBooks}
                setUserBooks={setUserBooks}
              />

              <button onClick={() => handleAdd(ub.bookId, "to-read")}>
                To Read
              </button>

              <button onClick={() => handleAdd(ub.bookId, "reading")}>
                Reading
              </button>

              <button onClick={() => handleAdd(ub.bookId, "completed")}>
                {ub.status === "completed" ? "✅ " : ""} Completed
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyLibrary;