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

const REGISTER_WITH_APPLE_MUTATION = gql`
  mutation RegisterWithApple($token: String!) {
    registerWithApple(token: $token) {
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

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [registerWithGoogleMutation] = useMutation(REGISTER_WITH_GOOGLE_MUTATION);
  const [registerWithMicrosoftMutation] = useMutation(REGISTER_WITH_MICROSOFT_MUTATION);
  const [registerWithAppleMutation] = useMutation(REGISTER_WITH_APPLE_MUTATION);

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const token = response.credential;
      const { data } = await registerWithGoogleMutation({
        variables: { token }
      });
      localStorage.setItem('token', data.registerWithGoogle.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Google registration failed');
    }
  };

  const handleGoogleError = () => {
    setError('Google registration failed');
  };

  const handleMicrosoftSuccess = async (response) => {
    try {
      const token = response.accessToken;
      const { data } = await registerWithMicrosoftMutation({
        variables: { token }
      });
      localStorage.setItem('token', data.registerWithMicrosoft.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Microsoft registration failed');
    }
  };

  const handleAppleSuccess = async (response) => {
    try {
      const token = response.authorization.id_token;
      const { data } = await registerWithAppleMutation({
        variables: { token }
      });
      localStorage.setItem('token', data.registerWithApple.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Apple registration failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div>
          <h2 className="form-title">Sign up</h2>
        </div>
        
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
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <button type="button" className="forgot-password" onClick={() => navigate('/login')}>Already have an account? Sign in</button>

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
              <span>Sign up with Google</span>
            </GoogleLogin>
          </GoogleOAuthProvider>

          <MsalProvider instance={msalInstance}>
            <MsalAuthenticationTemplate
              onSuccess={handleMicrosoftSuccess}
              onError={() => setError('Microsoft Sign Up Failed')}
              className="social-button"
            >
              <img src="https://img.icons8.com/color/48/000000/microsoft.png" alt="Microsoft" className="social-icon" />
              <span>Sign up with Microsoft</span>
            </MsalAuthenticationTemplate>
          </MsalProvider>

          <AppleSignin
            clientId={process.env.REACT_APP_APPLE_CLIENT_ID}
            redirectURI={process.env.REACT_APP_APPLE_REDIRECT_URI}
            onSuccess={handleAppleSuccess}
            onError={() => setError('Apple Sign Up Failed')}
            scope="email name"
            className="social-button apple-button"
          >
            <FaApple className="social-icon" />
            <span>Sign up with Apple</span>
          </AppleSignin>
        </div>
      </div>
    </div>
  );
}

export default Register;