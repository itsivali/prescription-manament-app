import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { useLocation } from 'react-router-dom';

const OAUTH_LOGIN_MUTATION = gql`
  mutation OAuthLogin($provider: String!, $token: String!) {
    oauthLogin(provider: $provider, token: $token) {
      token
      user {
        id
        email
      }
    }
  }
`;

function OAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [oauthLoginMutation] = useMutation(OAUTH_LOGIN_MUTATION);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const provider = query.get('provider');
    const token = query.get('token');

    if (provider && token) {
      handleOAuthLogin(provider, token);
    } else {
      navigate('/login');
    }
  }, [location, navigate, handleOAuthLogin]);

  const handleOAuthLogin = async (provider, token) => {
    try {
      const { data } = await oauthLoginMutation({
        variables: { provider, token }
      });
      localStorage.setItem('token', data.oauthLogin.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('OAuth login failed', err);
      navigate('/login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="form-title">Processing...</h2>
      </div>
    </div>
  );
}

export default OAuthRedirect;