import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaMicrosoft } from 'react-icons/fa';
import './Login.css';  // Updated import path

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
  const [error, setError] = useState('');

  const [registerWithGoogleMutation] = useMutation(REGISTER_WITH_GOOGLE_MUTATION);
  const [registerWithMicrosoftMutation] = useMutation(REGISTER_WITH_MICROSOFT_MUTATION);

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
        <div>
          <h2 className="form-title">Create Account</h2>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

       

        <div className="social-login">
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <button 
              className="social-button google-button"
              onClick={handleGoogleSuccess}
            >
              <FcGoogle className="social-icon" />
              <span>Continue with Google</span>
            </button>
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