import BookItem from "./BookItem";

function BookList({ books, search, userBooks, setUserBooks }) {
  const filtered = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          padding: "10px 0"
        }}
      >
        {filtered.length > 0 ? (
          filtered.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              userBooks={userBooks}
              setUserBooks={setUserBooks}
            />
          ))
        ) : (
          <p style={{ color: "#5D4037" }}>
            No books found.
          </p>
        )}
      </div>
    </div>
  );
}

export default BookList;