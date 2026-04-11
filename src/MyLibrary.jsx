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

      <h2>📚 To Read</h2>
      {toReadBooks.map((ub) => {
        const book = books.find(b => b.id === ub.bookId);
        if (!book) return null;

        return (
          <div key={ub.bookId}>
            <h3>{book.title}</h3>
          </div>
        );
      })}

      <h2>📖 Reading</h2>
      {readingBooks.map((ub) => {
        const book = books.find(b => b.id === ub.bookId);
        if (!book) return null;

        return (
          <div key={ub.bookId}>
            <h3>{book.title}</h3>
            <p>Progress: {ub.progress}%</p>

            <button onClick={() => increaseProgress(ub.bookId)}>
              +10%
            </button>
          </div>
        );
      })}

      <h2>✅ Completed</h2>
      {completedBooks.map((ub) => {
        const book = books.find(b => b.id === ub.bookId);
        if (!book) return null;

        return (
          <div key={ub.bookId}>
            <h3>{book.title}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default MyLibrary;