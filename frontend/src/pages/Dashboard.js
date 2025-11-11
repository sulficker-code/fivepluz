import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Users from "../pages/Users";
import Header from "../components/Header";

function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <p>Welcome to your dashboard.</p>;
      case "users":
        return <Users />;
      default:
        return <p>Page not found</p>;
    }
  };

  const getTitle = () => {
    switch (activePage) {
      case "dashboard":
        return "Dashboard";
      case "users":
        return "Users Management";
      default:
        return "Page";
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activePage={activePage} onMenuClick={setActivePage} />

      <div style={{ flex: 1, background: "#f4f4f9" }}>
        <Header title={getTitle()} />

        <main style={{ padding: "20px" }}>{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
