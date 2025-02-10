import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { FaEnvelope, FaLock, FaUser, FaChevronDown } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
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
  const [role, setRole] = useState('PATIENT');
  const [error, setError] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data } = await registerMutation({
        variables: { name, email, password, role },
      });
      localStorage.setItem('token', data.register.token);
      navigate(role === 'DOCTOR' ? '/doctor-dashboard' : role === 'PHARMACIST' ? '/pharmacist-dashboard' : '/patient-dashboard');
      toast.success('Registration successful!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
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
                      <FaUser className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="input-field"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="PATIENT">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="PHARMACIST">Pharmacist</option>
                      </select>
                    </div>
                    <button type="submit" className="button-primary">
                      {loading ? 'Registering...' : 'Register'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* SSO Registration */}
          <div className="w-full md:w-1/2 p-8 flex flex-col items-center">
            <GoogleLogin onSuccess={() => navigate('/patient-dashboard')} onError={() => toast.error('Google registration failed')} />
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
