import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import { FaMicrosoft, FaApple } from 'react-icons/fa';
import { toast } from 'react-toastify';
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

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $password, password: $password) {
      token
      user {
        id
        email
        role
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginWithGoogleMutation] = useMutation(LOGIN_WITH_GOOGLE_MUTATION);
  const [loginWithMicrosoftMutation] = useMutation(LOGIN_WITH_MICROSOFT_MUTATION);
  const [loginWithAppleMutation] = useMutation(LOGIN_WITH_APPLE_MUTATION);
  const [login] = useMutation(LOGIN_MUTATION);

const handleGoogleSuccess = async (response) => {
  try {
    const { data } = await loginWithGoogleMutation({
      variables: { token: response.credential }
    });
    localStorage.setItem('token', data.loginWithGoogle.token);
    navigate('/role-selection');
  } catch (err) {
    toast.error('Google login failed');
  }
};
const handleMicrosoftSuccess = async (response) => {
  try {
    const { data } = await loginWithMicrosoftMutation({
      variables: { token: response.accessToken }
    });
    localStorage.setItem('token', data.loginWithMicrosoft.token);
    navigate('/role-selection');
  } catch (err) {
    toast.error('Microsoft login failed');
  }
};
const handleAppleSuccess = async (response) => {
  try {
    const { data } = await loginWithAppleMutation({
      variables: { token: response.authorization.id_token }
    });
    localStorage.setItem('token', data.loginWithApple.token);
    navigate('/role-selection');
  } catch (err) {
    toast.error('Apple login failed');
  }
};
  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["user.read"]
      });
      handleMicrosoftSuccess(loginResponse);
    } catch (err) {
      toast.error('Microsoft login failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { email, password }
      });
      
      localStorage.setItem('token', data.login.token);
      
      if (data.login.user.role) {
        navigate(`/${data.login.user.role.toLowerCase()}-dashboard`);
      } else {
        navigate('/role-selection');
      }
      
      toast.success('Login successful!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="form-title">Sign in</h2>
        
        <div className="input-group">
          <label htmlFor="email" className="input-label">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <button type="submit" className="login-button">
          Sign in
        </button>
      </form>

      <div className="social-login">
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            render={({ onClick }) => (
              <button className="social-button google-button" onClick={onClick}>
                <FaApple className="social-icon" />
                <span className="social-text">Continue with Google</span>
              </button>
            )}
          />
        </GoogleOAuthProvider>

        <button className="social-button microsoft-button" onClick={handleMicrosoftLogin}>
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
  );
}

export default Login;
