import { useState } from "react";
import API from "../api";

function IssueBook() {

  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");

  const handleIssue = async (e) => {
    e.preventDefault();

    await API.post("/issues", {
      userId,
      bookId
    });

    alert("Book Issued Successfully");
  };

  return (
    <div>
      <h2>Issue Book</h2>

      <form onSubmit={handleIssue}>
        <input placeholder="User ID" onChange={(e) => setUserId(e.target.value)} /><br /><br />
        <input placeholder="Book ID" onChange={(e) => setBookId(e.target.value)} /><br /><br />

        <button>Issue</button>
      </form>
    </div>
  );
}

export default IssueBook;
