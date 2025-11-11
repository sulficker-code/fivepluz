import React from 'react'

function AddUserForm() {
  return (
    <div>
        {/* <div
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
          </div> */}
    </div>
  )
}

export default AddUserForm