import { useState } from "react";
import API from "../api";

function AddBook() {

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/books", {
      title,
      author,
      category,
      quantity,
      available: quantity
    });

    alert("Book Added Successfully");
  };

  return (
    <div>
      <h2>Add Book</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} /><br /><br />
        <input placeholder="Author" onChange={(e) => setAuthor(e.target.value)} /><br /><br />
        <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} /><br /><br />
        <input type="number" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} /><br /><br />

        <button>Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;
