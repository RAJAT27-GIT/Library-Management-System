import { useEffect, useState } from "react";
import API from "../api";

function ActiveIssues() {

  const [issues, setIssues] = useState([]);

  useEffect(() => {
    API.get("/issues/active").then(res => setIssues(res.data));
  }, []);

  return (
    <div>
      <h2>Active Issues</h2>

      {issues.map(issue => (
        <div key={issue._id}>
          <p>User: {issue.userId?.name}</p>
          <p>Book: {issue.bookId?.title}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default ActiveIssues;
