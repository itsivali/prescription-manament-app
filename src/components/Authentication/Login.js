import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import { FaMicrosoft, FaApple } from 'react-icons/fa';
import './Login.css';

const LOGIN_WITH_GOOGLE_MUTATION = gql`
  mutation LoginWithGoogle($token: String!) {
    loginWithGoogle(token: $token) {
      token
      user {
        id
        email
      }
    }
  }
`;

const LOGIN_WITH_MICROSOFT_MUTATION = gql`
  mutation LoginWithMicrosoft($token: String!) {
    loginWithMicrosoft(token: $token) {
      token
      user {
        id
        email
      }
    }
  }
`;

const LOGIN_WITH_APPLE_MUTATION = gql`
  mutation LoginWithApple($token: String!) {
    loginWithApple(token: $token) {
      token
      user {
        id
        email
      }
    }
  }
`;

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [loginWithGoogleMutation] = useMutation(LOGIN_WITH_GOOGLE_MUTATION);
  const [loginWithMicrosoftMutation] = useMutation(LOGIN_WITH_MICROSOFT_MUTATION);
  const [loginWithAppleMutation] = useMutation(LOGIN_WITH_APPLE_MUTATION);

  const handleGoogleSuccess = async (response) => {
    try {
      const token = response.credential;
      const { data } = await loginWithGoogleMutation({ variables: { token } });
      localStorage.setItem('token', data.loginWithGoogle.token);
      navigate('/dashboard');
    } catch {
      setError('Google login failed');
    }
  };

  const handleMicrosoftSuccess = async () => {
    try {
      const response = await msalInstance.loginPopup();
      const token = response.accessToken;
      const { data } = await loginWithMicrosoftMutation({ variables: { token } });
      localStorage.setItem('token', data.loginWithMicrosoft.token);
      navigate('/dashboard');
    } catch {
      setError('Microsoft login failed');
    }
  };

  const handleAppleSuccess = async (response) => {
    try {
      const token = response.authorization.id_token;
      const { data } = await loginWithAppleMutation({ variables: { token } });
      localStorage.setItem('token', data.loginWithApple.token);
      navigate('/dashboard');
    } catch {
      setError('Apple login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="form-title">Sign in</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="social-login">
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              render={({ onClick }) => (
                <button className="social-button google-button" onClick={onClick}>
                  <FaApple className="social-icon" />
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

        <div className="signup-link">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
