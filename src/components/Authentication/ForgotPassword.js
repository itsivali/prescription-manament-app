import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import '../Login.css';

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
    }
  }
`;

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [forgotPasswordMutation] = useMutation(FORGOT_PASSWORD_MUTATION);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await forgotPasswordMutation({
        variables: { email }
      });
      setMessage(data.forgotPassword.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div>
          <h2 className="form-title">Forgot Password</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
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

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <button type="button" className="forgot-password" onClick={() => navigate('/login')}>Back to Sign in</button>
      </div>
    </div>
  );
}

export default ForgotPassword;