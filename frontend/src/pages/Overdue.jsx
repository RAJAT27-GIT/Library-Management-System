import { useEffect, useState } from "react";
import API from "../api";

function Overdue() {

  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/issues/overdue").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Overdue Returns</h2>

      {data.map(issue => (
        <div key={issue._id}>
          <p>Issue ID: {issue._id}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Overdue;
