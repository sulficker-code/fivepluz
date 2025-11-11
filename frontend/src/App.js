import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./pages/LoginPage";
import Dashboard from './pages/Dashboard';
import UsersPage from "./pages/Users";
import Roles from './pages/Roles';
import Currency from "./pages/Currency";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/roles" 
          element={
            <ProtectedRoute>
              <Roles />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/currency" 
          element={
            <ProtectedRoute>
              <Currency />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
