import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Currency() {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const [currencies, setCurrencies] = useState([]);
  const [form, setForm] = useState({
    currency_code: "",
    currency_name: "",
    conversion_rate: "",
  });
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editCurrency, setEditCurrency] = useState(null);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);

  const fetchCurrencies = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/currency`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setCurrencies(data);
      else setCurrencies([]);
    } catch (err) {
      console.error(err);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const showTempMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.currency_code || !form.currency_name || !form.conversion_rate) {
      showTempMessage("⚠️ Please fill in all fields.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/currency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        showTempMessage("✅ Currency added successfully!");
        setForm({ currency_code: "", currency_name: "", conversion_rate: "" });
        fetchCurrencies();
      } else {
        if (data.message?.toLowerCase().includes("duplicate")) {
          showTempMessage("⚠️ This currency already exists.");
        } else {
          showTempMessage(`❌ ${data.message || "Failed to add currency."}`);
        }
      }
    } catch (err) {
      console.error(err);
      showTempMessage("❌ Server error");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await fetch(`${API_URL}/api/currency/${id}/default`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      showTempMessage("✅ Default currency updated!");
      fetchCurrencies();
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = (currency) => {
    if (currency.is_default) {
      showTempMessage("⚠️ You cannot delete the default currency.");
      return;
    }
    setCurrencyToDelete(currency);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/api/currency/${currencyToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        showTempMessage("🗑️ Currency deleted successfully!");
        setCurrencies((prev) =>
          prev.filter((c) => c.id !== currencyToDelete.id)
        );
        setShowDeleteConfirm(false);
      } else {
        const data = await res.json();
        showTempMessage(`❌ ${data.message || "Error deleting currency"}`);
      }
    } catch (err) {
      console.error(err);
      showTempMessage("❌ Server error while deleting");
      console.log("Fetching from:", `${API_URL}/api/currency`);

    }
  };

  const handleEdit = (currency) => {
    setEditCurrency(currency);
    setShowModal(true);
  };

  const handleEditChange = (e) =>
    setEditCurrency({ ...editCurrency, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/currency/${editCurrency.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editCurrency),
      });
      const data = await res.json();
      if (res.ok) {
        showTempMessage("✅ Currency updated successfully!");
        setShowModal(false);
        setEditCurrency(null);
        fetchCurrencies();
      } else {
        showTempMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      showTempMessage("❌ Server error");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, background: "#f5f7fa" }}>
        <Header />
        <main style={{ padding: "30px" }}>
          {/* Popup Message */}
          {showMessage && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                background: "#333",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                zIndex: 999,
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {message}
            </div>
          )}

          {/* Add Currency */}
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ marginBottom: "20px", color: "#2c3e50" }}>
              ➕ Add Currency
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <input
                name="currency_code"
                placeholder="Code (USD)"
                value={form.currency_code}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="currency_name"
                placeholder="Currency Name"
                value={form.currency_name}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="conversion_rate"
                placeholder="Rate"
                value={form.conversion_rate}
                onChange={handleChange}
                style={inputStyle}
              />
              <button type="submit" style={btnPrimary}>
                Add
              </button>
            </form>
          </div>

          {/* List Currencies */}
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: "15px", color: "#2c3e50" }}>
              💰 Currency List
            </h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Rate</th>
                  <th>Updated By</th>
                  <th>Updated At</th>
                  <th>Default</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((c) => (
                  <tr key={c.id}>
                    <td>{c.currency_code}</td>
                    <td>{c.currency_name}</td>
                    <td>{c.conversion_rate}</td>
                    <td>{c.updated_by_name || "-"}</td>
                    <td>{new Date(c.updated_at).toLocaleString()}</td>
                    <td>
                      {c.is_default ? (
                        "✅"
                      ) : (
                        <button
                          style={btnSmall}
                          onClick={() => handleSetDefault(c.id)}
                        >
                          Set Default
                        </button>
                      )}
                    </td>
                    <td>
                      <button style={btnEdit} onClick={() => handleEdit(c)}>
                        Edit
                      </button>{" "}
                      <button style={btnDelete} onClick={() => confirmDelete(c)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <h3>Edit Currency</h3>
              <form
                onSubmit={handleUpdate}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <input
                  name="currency_code"
                  value={editCurrency.currency_code}
                  onChange={handleEditChange}
                  style={inputStyle}
                />
                <input
                  name="currency_name"
                  value={editCurrency.currency_name}
                  onChange={handleEditChange}
                  style={inputStyle}
                />
                <input
                  name="conversion_rate"
                  value={editCurrency.conversion_rate}
                  onChange={handleEditChange}
                  style={inputStyle}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button type="button" onClick={() => setShowModal(false)} style={btnSecondary}>
                    Cancel
                  </button>
                  <button type="submit" style={btnPrimary}>
                    Save
                  </button>
                </div>
              </form>
            </Modal>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <Modal onClose={() => setShowDeleteConfirm(false)}>
              <h3>Confirm Delete</h3>
              <p>
                Are you sure you want to delete{" "}
                <strong>{currencyToDelete.currency_name}</strong>?
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setShowDeleteConfirm(false)} style={btnSecondary}>
                  No
                </button>
                <button onClick={handleDelete} style={btnDelete}>
                  Yes, Delete
                </button>
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
}

/* === REUSABLE COMPONENT === */
const Modal = ({ children, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        minWidth: "350px",
        maxWidth: "90%",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </div>
  </div>
);

/* === STYLES === */
const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  flex: "1",
};

const btnPrimary = {
  background: "#007bff",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};

const btnSecondary = {
  background: "#6c757d",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};

const btnSmall = {
  ...btnPrimary,
  padding: "6px 10px",
  fontSize: "13px",
};

const btnEdit = {
  background: "#28a745",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

const btnDelete = {
  background: "#dc3545",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};
tableStyle.th = tableStyle.td = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

export default Currency;
