import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // redirect to login
  };

  const handleProfile = () => {
    navigate("/profile"); // navigate to profile page
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        padding: "15px 30px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Dashboard</h1>

      <div style={{ position: "relative" }}>
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <span>{user?.name || "User"}</span>
          <div
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              background: "#4f46e5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              marginTop: "10px",
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: "6px",
              overflow: "hidden",
              zIndex: 10,
              minWidth: "150px",
            }}
          >
            <button
              onClick={handleProfile}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 15px",
                textAlign: "left",
                background: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 15px",
                textAlign: "left",
                background: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
