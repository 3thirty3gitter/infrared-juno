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

    const { signIn, signUp, resetPassword } = useAuth();
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
