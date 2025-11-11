import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Trash2, Edit } from "lucide-react";

function UsersPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
    status: "active",
  });

  // Toast message & visibility
  const [toastMessage, setToastMessage] = useState("");
  const [showToastFlag, setShowToastFlag] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Reusable toast helper
  const showToast = (msg, ms = 2500) => {
    setToastMessage(msg);
    setShowToastFlag(true);
    // clear previous timer if any by resetting flag then using setTimeout
    setTimeout(() => setShowToastFlag(false), ms);
  };

  // Fetch users and roles
  const fetchAll = useCallback(async () => {
    if (!API_URL) {
      console.error("REACT_APP_API_URL is not set");
      showToast("❌ API URL not configured");
      return;
    }
    try {
      const usersRes = await fetch(`${API_URL}/api/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!usersRes.ok) {
        const err = await usersRes.text();
        console.error("Users fetch failed:", usersRes.status, err);
        showToast("❌ Failed to fetch users");
      } else {
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      }

      const rolesRes = await fetch(`${API_URL}/api/roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!rolesRes.ok) {
        const err = await rolesRes.text();
        console.error("Roles fetch failed:", rolesRes.status, err);
        showToast("❌ Failed to fetch roles");
      } else {
        const rolesData = await rolesRes.json();
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      showToast("❌ Error fetching data");
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Generic form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ADD user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      showToast("⚠️ Please fill name, email and password");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showToast("✅ User added successfully!");
        setForm({ name: "", email: "", password: "", role_id: "", status: "active" });
        setShowAddModal(false);
        await fetchAll();
      } else {
        showToast(`❌ ${data.message || "Failed to add user"}`);
      }
    } catch (err) {
      console.error("Add user error:", err);
      showToast("❌ Server error while adding user");
    }
  };

  // OPEN edit modal
  const handleEdit = (user) => {
    setEditingUser({ ...user, password: "" });
    setShowEditModal(true);
  };

  // UPDATE user
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const payload = { ...editingUser };
      if (!payload.password) delete payload.password;

      const res = await fetch(`${API_URL}/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showToast("✏️ User updated successfully!");
        setShowEditModal(false);
        setEditingUser(null);
        await fetchAll();
      } else {
        showToast(`❌ ${data.message || "Failed to update user"}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      showToast("❌ Server error while updating user");
    }
  };

  // DELETE user (confirmed)
  const handleDeleteConfirmed = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast("🗑️ User deleted successfully!");
        await fetchAll();
      } else {
        showToast(`❌ ${data.message || "Failed to delete user"}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("❌ Server error while deleting user");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#888" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header title="Users Management" />
        <main style={{ padding: "20px" }}>
          {/* Add User Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "10px 18px",
                borderRadius: "6px",
                background: "#4f46e5",
                color: "#fff",
                fontWeight: "500",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              Add User
            </button>
          </div>

          {/* Add Modal */}
          {showAddModal && (
            <div style={modalBackdropStyle}>
              <div style={modalBoxStyle}>
                <h2 style={{ marginBottom: 10, color: "#111827" }}>Add User</h2>
                <form style={{ display: "flex", flexDirection: "column", gap: 10 }} onSubmit={handleAddUser}>
                  <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} style={inputStyle} />
                  <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
                  <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={inputStyle} />
                  <select name="role_id" value={form.role_id} onChange={handleChange} style={inputStyle}>
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                    <button type="submit" style={saveBtnStyle}>Save</button>
                    <button type="button" onClick={() => setShowAddModal(false)} style={cancelBtnStyle}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Toast popup (top-right) */}
          {showToastFlag && (
            <div
              style={{
                position: "fixed",
                top: 20,
                right: 20,
                background: toastMessage.startsWith("❌") ? "#ef4444" : "#16a34a",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: 10,
                boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                zIndex: 99999,
                animation: "toastInOut 2.5s ease forwards",
                fontWeight: 600,
              }}
            >
              {toastMessage}
            </div>
          )}

          <style>
            {`
              @keyframes toastInOut {
                0% { opacity: 0; transform: translateY(-8px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-8px); }
              }
            `}
          </style>

          {/* Message area (optional) */}
          {/* <div style={{ marginBottom: 12, color: toastMessage.startsWith("❌") ? "#b91c1c" : "#16a34a" }}>{toastMessage}</div> */}

          {/* Users table */}
          <div style={{ background: "white", padding: 20, borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", overflowX: "auto" }}>
            <h3 className="font-semibold text-primary border-bottom pb-2 mb-3 text-lx">User List</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.map((u) => (
                  <tr key={u.id}>
                    <td style={tdStyle}>{u.name}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>{roles.find((r) => r.id === u.role_id)?.name || "N/A"}</td>
                    <td style={tdStyle}>{u.status}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleEdit(u)} style={editBtnStyle}><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setConfirmDelete(u.id)} style={deleteBtnStyle}><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {showEditModal && editingUser && (
            <div style={modalBackdropStyle}>
              <div style={modalBoxStyle}>
                <h3>Edit User</h3>
                <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input name="name" value={editingUser.name || ""} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} style={inputStyle} />
                  <input name="email" value={editingUser.email || ""} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} style={inputStyle} />
                  <input name="password" type="password" placeholder="New password (leave blank to keep current)" value={editingUser.password || ""} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} style={inputStyle} />
                  <select name="role_id" value={editingUser.role_id || ""} onChange={(e) => setEditingUser({ ...editingUser, role_id: e.target.value })} style={inputStyle}>
                    <option value="">Select Role</option>
                    {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                  </select>
                  <select name="status" value={editingUser.status || "active"} onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })} style={inputStyle}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button type="submit" style={saveBtnStyle}>Update</button>
                    <button type="button" onClick={() => { setShowEditModal(false); setEditingUser(null); }} style={cancelBtnStyle}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete confirmation */}
          {confirmDelete && (
            <div style={modalBackdropStyle}>
              <div style={{ ...modalBoxStyle, textAlign: "center" }}>
                <h3 style={{ color: "#ef4444", marginBottom: 10 }}>🗑️ Delete User</h3>
                <p style={{ marginBottom: 20 }}>Are you sure you want to delete this user?</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 15 }}>
                  <button onClick={() => handleDeleteConfirmed(confirmDelete)} style={{ ...saveBtnStyle, background: "#ef4444" }}>Yes, Delete</button>
                  <button onClick={() => setConfirmDelete(null)} style={cancelBtnStyle}>No, Cancel</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------- styles ---------- */

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalBoxStyle = {
  background: "#fff",
  padding: 25,
  borderRadius: 10,
  width: 420,
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const inputStyle = { padding: 10, borderRadius: 6, border: "1px solid #ccc" };
const saveBtnStyle = { padding: "10px 20px", borderRadius: 6, border: "none", background: "#10b981", color: "white", cursor: "pointer" };
const cancelBtnStyle = { padding: "10px 20px", borderRadius: 6, border: "none", background: "#9ca3af", color: "white", cursor: "pointer" };
const thStyle = { padding: 10, border: "1px solid #ddd" };
const tdStyle = { padding: 10, border: "1px solid #ddd" };
const editBtnStyle = { padding: "5px 10px", borderRadius: 4, border: "none", background: "#f59e0b", color: "white", cursor: "pointer", marginRight: 8 };
const deleteBtnStyle = { padding: "5px 10px", borderRadius: 4, border: "none", background: "#ef4444", color: "white", cursor: "pointer" };

export default UsersPage;
