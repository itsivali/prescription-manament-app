import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { GoogleLogin } from '@react-oauth/google';
import { MsalAuthenticationTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { default as AppleSignIn } from 'react-apple-signin-auth';
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

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginMutation] = useMutation(LOGIN_MUTATION);

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

  const handleGoogleSuccess = (response) => {
    console.log('Google login successful:', response);
    // Handle Google login success logic here
  };

  const handleMicrosoftSuccess = (response) => {
    console.log('Microsoft login successful:', response);
    // Handle Microsoft login success logic here
  };

  const handleAppleSuccess = (response) => {
    console.log('Apple login successful:', response);
    // Handle Apple login success logic here
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
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign In Failed')}
            />
            
            {/* Microsoft login using MSAL */}
            <UnauthenticatedTemplate>
              <MsalAuthenticationTemplate 
                onSuccess={handleMicrosoftSuccess} 
                onError={() => setError('Microsoft Sign In Failed')}
              />
            </UnauthenticatedTemplate>

            {/* Apple login */}
            <AppleSignIn
              clientId={process.env.REACT_APP_APPLE_CLIENT_ID}
              redirectURI={process.env.REACT_APP_APPLE_REDIRECT_URI}
              onSuccess={handleAppleSuccess}
              onError={() => setError('Apple Sign In Failed')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
