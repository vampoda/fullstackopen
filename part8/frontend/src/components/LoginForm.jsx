import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../query';

const LoginForm = ({ setError, setToken, show, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      if (error.graphQLErrors.length > 0) {
        setErrorMessage(error.graphQLErrors[0].message);
      } else if (error.networkError) {
        setErrorMessage('Network error: Could not connect to the server.');
      } else {
        setErrorMessage('An unknown error occurred.');
      }
      setIsSubmitting(false); 
    }
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('user-token', token);
      setPage('authors');
    }
  }, [result.data, setToken, setPage]);

  useEffect(() => {
    const token = localStorage.getItem('user-token');
    if (token) {
      setToken(token);
      setPage('authors');
    }
  }, [setToken, setPage]);

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); 
    setIsSubmitting(true); 

    try {
      await login({ variables: { username, password } });
      setUsername('');
      setPassword('');
    } catch (error) {
  console.log(error)
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="username">Name</label>
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            type="text"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={password}
            type="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        {errorMessage && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {errorMessage}
          </div>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
