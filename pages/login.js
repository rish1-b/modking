import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      setError('Sign up successful! Check your email to confirm.');
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <div style={{ maxWidth: 400, margin: '60px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>MODKING</h2>
        <form onSubmit={handleLogin}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p style={{ color: error.includes('successful') ? '#51cf66' : '#ff6b6b', marginBottom: 12 }}>
              {error}
            </p>
          )}
          <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button
            onClick={handleSignup}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: '#6ee7ff',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Sign up instead
          </button>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link href="/">
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#6ee7ff',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Back to home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
