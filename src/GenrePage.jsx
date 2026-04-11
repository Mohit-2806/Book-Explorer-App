import { useParams } from "react-router-dom";

function GenrePage({ books, userBooks, setUserBooks }) {
  const { genre } = useParams();

  const filteredBooks = books.filter(
    (book) => book.genre === genre
  );

  return (
    <div>
      <h1>{genre}</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {filteredBooks.map((book) => (
          <div key={book.id}>
            <p>{book.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenrePage;