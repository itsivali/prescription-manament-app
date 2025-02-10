import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaMicrosoft, FaApple, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Default role is PATIENT; user can change if needed
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl overflow-hidden">
        <div className="flex">
          {/* Collapsible Email/Password Registration Form */}
          <div className={`transition-all duration-300 ${showEmailForm ? 'w-1/2 p-8' : 'w-16 p-4'} flex flex-col border-r border-gray-200`}>
            {showEmailForm ? (
              <>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FaUser className="mr-2 text-indigo-600" /> Register
                </h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <FaUser className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <FaEnvelope className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-4 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="PATIENT">Patient</option>
                      <option value="DOCTOR">Doctor</option>
                      <option value="PHARMACIST">Pharmacist</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors">
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </form>
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowEmailForm(false)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Collapse
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="transform rotate-90 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-transform"
                  title="Register with Email"
                >
                  <FaEnvelope />
                </button>
              </div>
            )}
          </div>
          {/* Vertical Divider */}
          <div className="w-px bg-gray-200"></div>
          {/* SSO Registration Options */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              SSO Registration
            </h2>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google registration failed')}
                render={({ onClick }) => (
                  <button onClick={onClick} className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition-colors mb-4">
                    <img src="/google-icon.svg" alt="Google" className="w-6 h-6 mr-2" />
                    <span>Continue with Google</span>
                  </button>
                )}
              />
            </GoogleOAuthProvider>
            <button onClick={handleMicrosoftSuccess} className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition-colors mb-4">
              <FaMicrosoft className="w-6 h-6 mr-2 text-blue-500" />
              <span>Continue with Microsoft</span>
            </button>
            <button onClick={handleAppleSuccess} className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition-colors">
              <FaApple className="w-6 h-6 mr-2" />
              <span>Continue with Apple</span>
            </button>
            <div className="text-center mt-6">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;