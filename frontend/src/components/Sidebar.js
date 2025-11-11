import React from "react";
import { NavLink } from "react-router-dom";
 
function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
 
  // All menu items
  const allMenuItems = [
    { path: "/dashboard", label: "Dashboard", roles: [1, 2] },
    { path: "/users", label: "Users", roles: [1] },
    { path: "/currency", label: "Currency", roles: [1, 2] },
    { path: "/customers", label: "Customers", roles: [1, 2] },
  ];
 
  const menuItems = allMenuItems.filter(item =>
    item.roles.includes(user?.role_id)
  );
 
  return (
    <div style={{ width: "220px", background: "#2d2f36", color: "white", padding: "20px" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => (
          <li key={item.path} style={{ marginBottom: "5px" }}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                display: "block",
                padding: "10px",
                borderRadius: "4px",
                color: "white",
                textDecoration: "none",
                background: isActive ? "#4f46e5" : "transparent",
              })}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
 
export default Sidebar;