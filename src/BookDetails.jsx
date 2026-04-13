import { useParams } from "react-router-dom";

function BookDetails({ books, userBooks }) {
  const { id } = useParams();

  // ✅ safer match (handles string/number mismatch)
  const book = books.find((b) => String(b.id) === String(id));
  if (!book) return <h1 style={{ color: "white" }}>Not found</h1>;

  const current = userBooks.find((b) => String(b.bookId) === String(id));

  return (
    <div style={container}>
      <div style={content}>
        {/* IMAGE */}
        <img
          src="https://picsum.photos/250/350"
          alt={book.title}
          style={image}
        />

        {/* DETAILS */}
        <div style={details}>
          <h1 style={title}>{book.title}</h1>

          <p style={text}>
            <span style={label}>Genre:</span> {book.genre}
          </p>

          <p style={text}>
            <span style={label}>Rating:</span>{" "}
            {"★".repeat(Math.round(book.rating || 4))}
          </p>

          <p style={text}>
            <span style={label}>Status:</span>{" "}
            {current?.status || "Not added"}
          </p>

          <p style={description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.

            <br /><br />

            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

            <br /><br />

            Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam
            varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus
            magna felis sollicitudin mauris.
          </p>


          {/* PROGRESS */}
          {current?.status === "reading" && (
            <div style={{ marginTop: "10px" }}>
              <div style={progressBg}>
                <div
                  style={{
                    ...progressFill,
                    width: `${current.progress || 0}%`
                  }}
                />
              </div>
              <p style={{ fontSize: "12px", marginTop: "5px", color: "#aaa" }}>
                {current.progress || 0}% completed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* STYLES */


const container = {
  position: "absolute",
  top: "65px",
  left: "220px",
  right: 0,
  bottom: 0,
  background: "#191A1C",
  padding: "30px",
  fontFamily: "'Montserrat', sans-serif"
};



const content = {
  display: "flex",
  gap: "50px",
  alignItems: "flex-start",
  maxWidth: "1000px" // ✅ limits width but keeps LEFT aligned
};

const image = {
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
};

const details = {
  color: "#EDEDED"
};

const title = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "32px",
  color: "#FFD54F",
  marginBottom: "10px"
};

const text = {
  marginBottom: "8px"
};

const label = {
  color: "#F5E6A8"
};

const progressBg = {
  height: "6px",
  width: "250px",
  background: "#333",
  borderRadius: "6px"
};

const progressFill = {
  height: "100%",
  background: "#FFD54F",
  borderRadius: "6px",
  transition: "width 0.3s ease"
};
const description = {
  marginTop: "20px",
  lineHeight: "1.6",
  color: "#ccc",
  maxWidth: "600px" // ✅ keeps it readable
};

export default BookDetails;