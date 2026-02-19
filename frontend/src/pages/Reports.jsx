import { useEffect, useState } from "react";
import API from "../api";

function Reports() {

  const [report, setReport] = useState({});

  useEffect(() => {
    API.get("/issues/report").then(res => setReport(res.data));
  }, []);

  return (
    <div>
      <h2>Library Reports</h2>

      <p>Total Books: {report.totalBooks}</p>
      <p>Total Users: {report.totalUsers}</p>
      <p>Currently Issued Books: {report.issuedBooks}</p>
    </div>
  );
}

export default Reports;
