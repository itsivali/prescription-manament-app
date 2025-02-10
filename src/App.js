import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import RoleSelection from './components/Authentication/RoleSelection';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import PharmacistDashboard from './components/Dashboard/PharmacistDashboard';
import ForgotPassword from './components/Authentication/ForgotPassword';
import OAuthRedirect from './components/Authentication/OAuthRedirect';
import client from './ApolloClient';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>      
        <div className="App">
          <h1 className="app-name">Prescription Management System</h1>
          <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/oauth-redirect" element={<OAuthRedirect />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </ApolloProvider>
  );
}

export default App;