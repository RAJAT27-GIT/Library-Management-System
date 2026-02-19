import { useState } from "react";
import API from "../api";

function ReturnBook() {

  const [issueId, setIssueId] = useState("");
  const [result, setResult] = useState(null);

  const handleReturn = async () => {
    const res = await API.put(`/issues/return/${issueId}`);
    setResult(res.data);
    alert("Book Returned Successfully");
  };

  return (
    <div>
      <h2>Return Book</h2>

      <input placeholder="Issue ID" onChange={(e) => setIssueId(e.target.value)} /><br /><br />

      <button onClick={handleReturn}>Return</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <p>Fine: ₹{result.fine}</p>
          <p>Status: {result.status}</p>
        </div>
      )}
    </div>
  );
}

export default ReturnBook;
