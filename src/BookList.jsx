import BookItem from "./BookItem";

function BookList({ books, search, userBooks, setUserBooks }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        padding: "10px 0"
      }}
    >
      {books
        .filter((book) =>
          book.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((book) => (
          <BookItem
            key={book.id}
            book={book}
            userBooks={userBooks}
            setUserBooks={setUserBooks}
          />
        ))}
    </div>
  );
}

export default BookList;