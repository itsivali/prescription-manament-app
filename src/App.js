import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { client } from './ApolloClient';
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import ForgotPassword from './components/Authentication/ForgotPassword';
import OAuthRedirect from './components/Authentication/OAuthRedirect';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/oauth-redirect" element={<OAuthRedirect />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;