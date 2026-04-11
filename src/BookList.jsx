import BookItem from "./BookItem";

function BookList({ books, setBooks, search, userBooks, setUserBooks }) {  
    return (
        <ul>
        {books
            .filter((book) =>
            book.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((book, index) => (
            <BookItem
                key={book.id}
                book={book}
                userBooks={userBooks}
                setUserBooks={setUserBooks}
            />
            ))}
        </ul>
    );
}

export default BookList;