import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            if (view === 'signup') {
                const { error } = await signUp({ email, password });
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            } else if (view === 'login') {
                const { error } = await signIn({ email, password });
                if (error) throw error;
                navigate('/');
            } else if (view === 'forgot') {
                const { error } = await resetPassword(email);
                if (error) throw error;
                setMessage('Check your email for the password reset link.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <h1>
                {view === 'signup' && 'Create Account'}
                {view === 'login' && 'Welcome Back'}
                {view === 'forgot' && 'Reset Password'}
            </h1>
            <div className="glass-card">
                {error && <div style={{ color: '#ff4444', marginBottom: '12px', background: 'rgba(255, 68, 68, 0.1)', padding: '8px', borderRadius: '4px' }}>{error}</div>}
                {message && <div style={{ color: '#32ff64', marginBottom: '12px', background: 'rgba(50, 255, 100, 0.1)', padding: '8px', borderRadius: '4px' }}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    {view !== 'forgot' && (
                        <div style={{ marginTop: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    {view === 'login' && (
                        <div style={{ textAlign: 'right', marginTop: '8px' }}>
                            <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '24px' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (
                            view === 'signup' ? 'Sign Up' :
                                view === 'login' ? 'Log In' : 'Send Reset Link'
                        )}
                    </button>

                    {(view === 'login' || view === 'signup') && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 16px', color: 'var(--color-text-muted)' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                                <span style={{ padding: '0 12px', fontSize: '0.9rem' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                            </div>

                            <button
                                type="button"
                                onClick={() => signInWithGoogle()}
                                className="btn"
                                style={{
                                    width: '100%',
                                    background: 'white',
                                    color: '#333',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    fontWeight: 600
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Sign in with Google
                            </button>
                        </>
                    )}
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                    {view === 'login' && (
                        <button className="btn btn-ghost" onClick={() => setView('signup')}>
                            Need an account? <span style={{ color: 'var(--color-accent)', marginLeft: '4px' }}>Sign Up</span>
                        </button>
                    )}
                    {view === 'signup' && (
                        <button className="btn btn-ghost" onClick={() => setView('login')}>
                            Already have an account? <span style={{ color: 'var(--color-accent)', marginLeft: '4px' }}>Log In</span>
                        </button>
                    )}
                    {view === 'forgot' && (
                        <button className="btn btn-ghost" onClick={() => setView('login')}>
                            Back to <span style={{ color: 'var(--color-accent)', marginLeft: '4px' }}>Log In</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
