import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AuthScreen({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // On success, App.jsx's onAuthStateChanged will handle the view change
    } catch (err) {
      let cleanError = err.message;
      if (err.code === 'auth/invalid-credential') cleanError = 'Invalid email or password.';
      if (err.code === 'auth/email-already-in-use') cleanError = 'This email is already registered.';
      if (err.code === 'auth/weak-password') cleanError = 'Password must be at least 6 characters.';
      setError(cleanError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <button className="secondary-btn glass-panel" onClick={onBack} style={{ padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-light)' }}>
          ← Back
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '24px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'Space Grotesk' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {isLogin ? 'Enter your details to log in.' : 'Join to track your trivia stats.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-light)', outline: 'none',
              fontFamily: 'Outfit'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-light)', outline: 'none',
              fontFamily: 'Outfit'
            }}
          />
          
          {error && <div style={{ color: 'var(--timer-warn)', fontSize: '0.9rem' }}>{error}</div>}

          <button 
            type="submit" 
            className="restart-btn" 
            disabled={loading}
            style={{ width: '100%', margin: '1rem 0 0 0', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 600, fontFamily: 'Outfit' }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
