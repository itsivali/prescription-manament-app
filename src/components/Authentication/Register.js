import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaMicrosoft, FaApple } from 'react-icons/fa';
import './Login.css';

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $role: String!) {
    register(name: $name, email: $email, password: $password, role: $role) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Default role is PATIENT for new registrations; user can select another role if desired
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
        variables: { name, email, password, role },
      });
      localStorage.setItem('token', data.register.token);
      // Redirect based on the selected role
      if (role === 'DOCTOR') {
        navigate('/doctor-dashboard');
      } else if (role === 'PHARMACIST') {
        navigate('/pharmacist-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
      toast.success('Registration successful!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  // SSO Handlers (simulate registration via SSO)
  const handleGoogleSuccess = async (response) => {
    try {
      localStorage.setItem('token', response.credential);
      navigate('/patient-dashboard');
      toast.success('Google registration successful!');
    } catch (err) {
      toast.error('Google registration failed');
    }
  };

  const handleMicrosoftSuccess = async (response) => {
    try {
      localStorage.setItem('token', response.accessToken);
      navigate('/patient-dashboard');
      toast.success('Microsoft registration successful!');
    } catch (err) {
      toast.error('Microsoft registration failed');
    }
  };

  const handleAppleSuccess = async (response) => {
    try {
      localStorage.setItem('token', response.authorization.id_token);
      navigate('/patient-dashboard');
      toast.success('Apple registration successful!');
    } catch (err) {
      toast.error('Apple registration failed');
    }
  };

  return (
    <div className="login-container flex justify-center items-center min-h-screen bg-gray-100">
      <div className="login-form bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="form-title text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="input-group">
            <label htmlFor="name" className="input-label block mb-1">Name</label>
            <input
              type="text"
              id="name"
              className="input-field w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email" className="input-label block mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="input-field w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
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
              placeholder="Password"
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
              placeholder="Confirm Password"
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
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="PHARMACIST">Pharmacist</option>
            </select>
          </div>
          <button type="submit" className="login-button w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="social-login mt-6">
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google registration failed')}
              render={({ onClick }) => (
                <button className="social-button google-button" onClick={onClick}>
                  <img src="/google-icon.svg" alt="Google" className="social-icon" />
                  <span className="social-text">Continue with Google</span>
                </button>
              )}
            />
          </GoogleOAuthProvider>
          
          <button className="social-button microsoft-button" onClick={handleMicrosoftSuccess}>
            <FaMicrosoft className="social-icon text-blue-500" />
            <span className="social-text">Continue with Microsoft</span>
          </button>
          
          <button className="social-button apple-button" onClick={handleAppleSuccess}>
            <FaApple className="social-icon" />
            <span className="social-text">Continue with Apple</span>
          </button>
        </div>
        
        <div className="signup-link text-center mt-6">
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