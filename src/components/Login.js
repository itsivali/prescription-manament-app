import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { MsalProvider, MsalAuthenticationTemplate } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import AppleSignin from 'react-apple-signin-auth';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">Sign in</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <EnvelopeIcon className="h-5 w-5 absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <LockClosedIcon className="h-5 w-5 absolute top-3 left-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                placeholder="Password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </GoogleOAuthProvider>

            <MsalProvider instance={msalInstance}>
              <MsalAuthenticationTemplate
                onSuccess={handleMicrosoftSuccess}
                onError={() => setError('Microsoft Sign In Failed')}
              />
            </MsalProvider>

            <AppleSignin
              clientId={process.env.REACT_APP_APPLE_CLIENT_ID}
              redirectURI={process.env.REACT_APP_APPLE_REDIRECT_URI}
              onSuccess={handleAppleSuccess}
              onError={() => setError('Apple Sign In Failed')}
              scope="email name"
              className="apple-auth-btn"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;