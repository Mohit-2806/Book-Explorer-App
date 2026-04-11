import { useParams } from "react-router-dom";
import BookItem from "./BookItem";

function GenrePage({ books, userBooks, setUserBooks }) {
    const { genre } = useParams();

    const filteredBooks = books.filter((b) =>
    b.genre.toLowerCase().includes(genre.toLowerCase())
    );

    return (
        <div style={{ padding: "20px" }}>
        <h1>{genre} Books</h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {filteredBooks.map((book) => (
            <BookItem
                key={book.id}
                book={book}
                userBooks={userBooks}
                setUserBooks={setUserBooks}
            />
            ))}
        </div>
        </div>
    );
}

export default GenrePage;