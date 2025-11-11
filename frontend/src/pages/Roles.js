import React, { useState, useEffect } from "react";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roles"); // your API endpoint
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!roleName) return;
    try {
      const res = await fetch("http://localhost:5000/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roleName }),
      });
      const data = await res.json();
      alert(data.message || "Role added!");
      setRoleName("");
      fetchRoles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Roles Management</h2>

      <form onSubmit={handleAddRole} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <button type="submit">Add Role</button>
      </form>

      <h3>Roles List</h3>
      <ul>
        {roles.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Roles;
