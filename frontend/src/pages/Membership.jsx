import { useState } from "react";
import API from "../api";

function Membership() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [membershipType, setMembershipType] = useState("");
  const [expiry, setExpiry] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/users", {
      name,
      email,
      membershipType,
      membershipExpiry: expiry
    });

    alert("Membership Added Successfully");
  };

  return (
    <div>
      <h2>Add Membership</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} /><br /><br />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br /><br />
        <input placeholder="Membership Type" onChange={(e) => setMembershipType(e.target.value)} /><br /><br />
        <input type="date" onChange={(e) => setExpiry(e.target.value)} /><br /><br />

        <button>Add Membership</button>
      </form>
    </div>
  );
}

export default Membership;
