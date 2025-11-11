import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Users from "../pages/Users"; 


function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <p>Welcome to your dashboard.</p>;
      case "users":
        return <Users />; // Show UsersPage component
      default:
        return <p>Page not found</p>;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activePage={activePage} onMenuClick={setActivePage} />

      <div style={{ flex: 1, background: "#f4f4f9" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "white",
            padding: "15px 30px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
            {activePage === "dashboard" ? "Dashboard" : "Users Management"}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Admin</span>
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
                cursor: "pointer",
              }}
            >
              U
            </div>
          </div>
        </header>

        {/* Main content */}
        <main style={{ padding: "20px" }}>{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
