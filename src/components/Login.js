import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { MsalProvider, MsalAuthenticationTemplate } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import AppleSignin from 'react-apple-signin-auth';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import '../Login.css';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [loginWithGoogleMutation] = useMutation(LOGIN_WITH_GOOGLE_MUTATION);
  const [loginWithMicrosoftMutation] = useMutation(LOGIN_WITH_MICROSOFT_MUTATION);
  const [loginWithAppleMutation] = useMutation(LOGIN_WITH_APPLE_MUTATION);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginMutation({
        variables: { email, password }
      });
      localStorage.setItem('token', data.login.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const token = response.credential;
      const { data } = await loginWithGoogleMutation({
        variables: { token }
      });
      localStorage.setItem('token', data.loginWithGoogle.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Google login failed');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

  const handleMicrosoftSuccess = async (response) => {
    try {
      const token = response.accessToken;
      const { data } = await loginWithMicrosoftMutation({
        variables: { token }
      });
      localStorage.setItem('token', data.loginWithMicrosoft.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Microsoft login failed');
    }
  };

  const handleAppleSuccess = async (response) => {
    try {
      const token = response.authorization.id_token;
      const { data } = await loginWithAppleMutation({
        variables: { token }
      });
      localStorage.setItem('token', data.loginWithApple.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Apple login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div>
          <h2 className="form-title">Sign in</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <button type="button" className="forgot-password" onClick={() => navigate('/forgot-password')}>Forgot your password?</button>

        <div className="divider">
          <span className="divider-text">Or continue with</span>
        </div>

        <div className="social-login">
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              className="social-button google-button"
            >
              <FcGoogle className="social-icon" />
              <span>Sign in with Google</span>
            </GoogleLogin>
          </GoogleOAuthProvider>

          <MsalProvider instance={msalInstance}>
            <MsalAuthenticationTemplate
              onSuccess={handleMicrosoftSuccess}
              onError={() => setError('Microsoft Sign In Failed')}
              className="social-button"
            >
              <img src="https://img.icons8.com/color/48/000000/microsoft.png" alt="Microsoft" className="social-icon" />
              <span>Sign in with Microsoft</span>
            </MsalAuthenticationTemplate>
          </MsalProvider>

          <AppleSignin
            clientId={process.env.REACT_APP_APPLE_CLIENT_ID}
            redirectURI={process.env.REACT_APP_APPLE_REDIRECT_URI}
            onSuccess={handleAppleSuccess}
            onError={() => setError('Apple Sign In Failed')}
            scope="email name"
            className="social-button apple-button"
          >
            <FaApple className="social-icon" />
            <span>Sign in with Apple</span>
          </AppleSignin>
        </div>
      </div>
    </div>
  );
}

export default Login;