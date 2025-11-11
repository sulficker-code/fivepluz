import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/Header"; 
import Sidebar from "../components/Sidebar";

function Currency() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [currencies, setCurrencies] = useState([]);
  const [form, setForm] = useState({ currency_code: "", currency_name: "", conversion_rate: "" });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('token');

  const fetchCurrencies = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/currency`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setCurrencies(data);  
      else setCurrencies([]);
    } catch (err) {
      console.error(err);
    }
  }, [API_URL, token]);

  useEffect(() => { fetchCurrencies(); }, [fetchCurrencies]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/currency`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Currency added successfully!");
        setForm({ currency_code: "", currency_name: "", conversion_rate: "" });
        fetchCurrencies();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };
  

  const handleSetDefault = async (id) => {
    try {
      await fetch(`${API_URL}/api/currency/${id}/default`, { 
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCurrencies();
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, background: "#f4f4f9" }}>
        <Header />
        <main style={{ padding: "20px" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
            <h2>Add Currency</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
              <input name="currency_code" placeholder="Code (USD)" value={form.currency_code} onChange={handleChange} />
              <input name="currency_name" placeholder="Currency Name" value={form.currency_name} onChange={handleChange} />
              <input name="conversion_rate" placeholder="Rate" value={form.conversion_rate} onChange={handleChange} />
              <button type="submit">Add</button>
            </form>
            {message && <p>{message}</p>}
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
            <h3>Currency List</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Rate</th>
                  <th>Updated By</th>
                  <th>Updated At</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(currencies) && currencies.map(c => (
                  <tr key={c.id}>
                    <td>{c.currency_code}</td>
                    <td>{c.currency_name}</td>
                    <td>{c.conversion_rate}</td>
                    <td>{c.updated_by_name || "-"}</td>
                    <td>{new Date(c.updated_at).toLocaleString()}</td>
                    <td>
                      {c.is_default ? "✅" : <button onClick={() => handleSetDefault(c.id)}>Set Default</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Currency;
