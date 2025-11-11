import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Dashboard from './pages/Dashboard';
import UsersPage from "./pages/Users";
import Roles from './pages/Roles';
import CustomersPage from './pages/Customers';
import ProtectedRoute from "./components/ProtectedRoute";
import Currency from "./pages/Currency";
import LoginPage from "./pages/LoginPage";
// import Customer from "./pages/Customers";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />

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
        <Route 
          path="/customers" 
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      
    </Router>
  );
}
export default App;
