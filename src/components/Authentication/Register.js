import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import './Login.css';  // Updated import path

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $role: String!) {
    register(email: $email, password: $password, role: $role) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [error, setError] = useState('');

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      const { data } = await registerMutation({
        variables: { email, password, role },
      });
      localStorage.setItem('token', data.register.token);
      
      // Redirect based on assigned role
      if (role === 'DOCTOR') {
        navigate('/doctor-dashboard');
      } else if (role === 'PHARMACIST') {
        navigate('/pharmacist-dashboard');
      } else {
        // Patients can only view their records
        navigate('/patient-dashboard');
      }
      toast.success('Registration successful!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="login-container flex justify-center items-center min-h-screen bg-gray-100">
      <div className="login-form bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="form-title text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="input-group">
            <label htmlFor="email" className="input-label block mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="input-field w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="input-label block mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="input-field w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label block mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="role" className="input-label block mb-1">Select Role</label>
            <select
              id="role"
              className="input-field w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="DOCTOR">Doctor</option>
              <option value="PHARMACIST">Pharmacist</option>
              <option value="PATIENT">Patient</option>
            </select>
          </div>

          <button type="submit" className="login-button w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="signup-link text-center mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;