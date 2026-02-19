import { useState } from "react";
import API from "../api";

function UpdateBook() {

  const [id, setId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleUpdate = async () => {
    await API.put(`/books/${id}`, {
      quantity,
      available: quantity
    });

    alert("Book Updated Successfully");
  };

  return (
    <div>
      <h2>Update Book Quantity</h2>

      <input placeholder="Book ID" onChange={(e) => setId(e.target.value)} /><br /><br />
      <input type="number" placeholder="New Quantity" onChange={(e) => setQuantity(e.target.value)} /><br /><br />

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}

export default UpdateBook;
