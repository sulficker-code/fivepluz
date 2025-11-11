import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";

function UsersPage() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
    status: "active",
  });
  const [message, setMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch users and roles
  const fetchAll = useCallback(async () => {
    try {
      const usersRes = await fetch(`${API_URL}/api/users`);
      const usersData = await usersRes.json();
      setUsers(usersData);

      const rolesRes = await fetch(`${API_URL}/api/roles`);
      const rolesData = await rolesRes.json();
      setRoles(rolesData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Handle Add User
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("User added successfully!");
        setForm({ name: "", email: "", password: "", role_id: "", status: "active" });
        fetchAll();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  // Handle Edit
  const handleEdit = (user) => {
    setEditingUser({ ...user, password: "" }); 
  };

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...editingUser };
      if (!payload.password) delete payload.password; 
      const res = await fetch(`${API_URL}/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(" User updated successfully!");
        setShowModal(false);
        setEditingUser(null);
        fetchAll();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("🗑️ User deleted successfully!");
        fetchAll();
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, background: "#f4f4f9" }}>
        <main style={{ padding: "20px" }}>
          {/* Add User Form */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              marginBottom: "20px",
              maxWidth: "400px",
            }}
          >
            <h2>Add User</h2>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              onSubmit={handleSubmit}
            >
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
              <select
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
                style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                type="submit"
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "none",
                  background: "#4f46e5",
                  color: "white",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Add User
              </button>
            </form>
            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
          </div>

          {/* User List */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              overflowX: "auto",
            }}
          >
            <h3>User List</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Role</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.name}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.email}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {roles.find((r) => r.id === u.role_id)?.name || "N/A"}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.status}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <button
                        onClick={() => handleEdit(u)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "4px",
                          border: "none",
                          background: "#f59e0b",
                          color: "white",
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "4px",
                          border: "none",
                          background: "#ef4444",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {showModal && editingUser && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  width: "400px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                <h3>Edit User</h3>
                <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    name="name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                  <input
                    name="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="New password (leave blank to keep current)"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                  <select
                    name="role_id"
                    value={editingUser.role_id}
                    onChange={(e) => setEditingUser({ ...editingUser, role_id: e.target.value })}
                    style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="status"
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                      type="submit"
                      style={{
                        padding: "10px 20px",
                        background: "#4f46e5",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingUser(null);
                      }}
                      style={{
                        padding: "10px 20px",
                        background: "#9ca3af",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default UsersPage;
