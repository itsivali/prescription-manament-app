import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaMicrosoft } from 'react-icons/fa';
import './Login.css'; 

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

const REGISTER_WITH_GOOGLE_MUTATION = gql`
  mutation RegisterWithGoogle($token: String!) {
    registerWithGoogle(token: $token) {
      token
      user {
        id
        email
      }
    }
  }
`;

const REGISTER_WITH_MICROSOFT_MUTATION = gql`
  mutation RegisterWithMicrosoft($token: String!) {
    registerWithMicrosoft(token: $token) {
      token
      user {
        id
        email
      }
    }
  }
`;

// Microsoft MSAL Configuration
const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [registerWithGoogleMutation] = useMutation(REGISTER_WITH_GOOGLE_MUTATION);
  const [registerWithMicrosoftMutation] = useMutation(REGISTER_WITH_MICROSOFT_MUTATION);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerMutation({
        variables: { email, password }
      });
      localStorage.setItem('token', data.register.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const { data } = await registerWithGoogleMutation({
        variables: { token: response.credential }
      });
      localStorage.setItem('token', data.registerWithGoogle.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Google registration failed');
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["user.read"],
        prompt: "select_account"
      });
      
      const { data } = await registerWithMicrosoftMutation({
        variables: { token: loginResponse.accessToken }
      });
      
      localStorage.setItem('token', data.registerWithMicrosoft.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Microsoft registration failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="form-title">Create Account</h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleEmailRegister}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email address</label>
            <div className="input-field">
              <EnvelopeIcon className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="Email address"
              />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <div className="input-field">
              <LockClosedIcon className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                placeholder="Password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="divider">
          <span className="divider-text">Or continue with</span>
        </div>

        <div className="social-login">
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              render={(renderProps) => (
                <button
                  className="social-button google-button"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="social-icon" />
                  <span>Continue with Google</span>
                </button>
              )}
            />
          </GoogleOAuthProvider>

          <button 
            className="social-button microsoft-button"
            onClick={handleMicrosoftLogin}
          >
            <FaMicrosoft className="social-icon text-blue-500" />
            <span>Continue with Microsoft</span>
          </button>

          <button className="social-button apple-button">
            <FaApple className="social-icon" />
            <span>Continue with Apple</span>
          </button>
        </div>

        <div className="signup-link">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
