import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function BookDetails({ books }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books[id]; // using index for now

  if (!book) {
    return <h2>Book not found</h2>;
  }
  

  return (
    

    <div style={{ padding: "20px" }}>
        <button onClick={() => navigate("/")}>
        ⬅ Back
        </button>
        <h1>{book.title}</h1>

        <p><strong>Status:</strong> {book.status}</p>
        <p><strong>Progress:</strong> {book.progress}%</p>

        <hr />

        <h3>About this book</h3>
        <p>This is where description will go later (from API)</p>
    </div>
    );
}

export default BookDetails;
