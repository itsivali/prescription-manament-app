import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaMicrosoft, FaApple, FaEnvelope, FaLock, FaUser, FaChevronDown } from 'react-icons/fa';
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
  // Default role is PATIENT; user can also select others from the dropdown
  const [role, setRole] = useState('PATIENT');
  const [error, setError] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-5xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Email Registration Container */}
          <div className="w-full md:w-1/2 p-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <button 
                onClick={() => setIsFormExpanded(!isFormExpanded)}
                className="w-full flex items-center justify-between text-lg font-semibold text-gray-700 mb-4"
              >
                <span>Register with Email</span>
                <FaChevronDown className={`transform transition-transform duration-200 ${isFormExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {isFormExpanded && (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

          {/* SSO Registration Container */}
          <div className="w-full md:w-1/2 p-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Quick Registration
              </h2>
              <div className="space-y-4">
                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google registration failed')}
                    render={({ onClick }) => (
                      <button 
                        onClick={onClick} 
                        className="w-full flex items-center justify-center bg-white border-2 border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
                      >
                        <img src="/google-icon.svg" alt="Google" className="w-6 h-6 mr-2" />
                        <span className="font-medium">Continue with Google</span>
                      </button>
                    )}
                  />
                </GoogleOAuthProvider>

                <button 
                  onClick={handleMicrosoftSuccess} 
                  className="w-full flex items-center justify-center bg-white border-2 border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
                >
                  <FaMicrosoft className="w-6 h-6 mr-2 text-blue-500" />
                  <span className="font-medium">Continue with Microsoft</span>
                </button>

                <button 
                  onClick={handleAppleSuccess} 
                  className="w-full flex items-center justify-center bg-black text-white p-3 rounded-lg hover:bg-gray-900 transition-colors shadow-sm hover:shadow-md"
                >
                  <FaApple className="w-6 h-6 mr-2" />
                  <span className="font-medium">Continue with Apple</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-4 border-t">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;