import { useEffect, useState } from "react";
import API from "../api";

function Books() {

  const [books, setBooks] = useState([]);

  useEffect(() => {
    API.get("/books").then(res => setBooks(res.data));
  }, []);

  return (
    <div>
      <h2>All Books</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.available}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Books;
