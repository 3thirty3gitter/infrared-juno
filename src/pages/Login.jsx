import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isSignUp) {
                const { error } = await signUp({ email, password });
                if (error) throw error;
                alert('Check your email for the login link!');
            } else {
                const { error } = await signIn({ email, password });
                if (error) throw error;
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
            <div className="glass-card">
                {error && <div style={{ color: '#ff4444', marginBottom: '12px' }}>{error}</div>}
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
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '16px' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                    </button>
                </form>

                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.9rem' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
