import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Scan, Mic, ArrowRight, Smartphone, Zap, Cloud } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGetStarted = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div style={{ paddingBottom: '0' }}>
            {/* Hero Section */}
            <section style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: '40px 20px'
            }}>
                {/* Background Glows */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(138, 43, 226, 0.4) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: -1,
                    pointerEvents: 'none'
                }} />

                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-20%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(0, 210, 255, 0.2) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: -1,
                    pointerEvents: 'none'
                }} />

                <div className="glass-card" style={{
                    padding: '12px 24px',
                    borderRadius: '50px',
                    marginBottom: '24px',
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    background: 'rgba(0, 210, 255, 0.1)'
                }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.9rem' }}>
                        ✨ V1.0 Now Live
                    </span>
                </div>

                <h1 style={{
                    fontSize: '4rem',
                    lineHeight: 1,
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #fff 0%, #a0a0ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 40px rgba(138, 43, 226, 0.5)'
                }}>
                    BoxedUp
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    maxWidth: '400px',
                    marginBottom: '40px',
                    color: 'rgba(255,255,255,0.8)'
                }}>
                    Organize your physical reality. <br />
                    Scan, Search, and Find anything in seconds.
                </p>

                <button
                    onClick={handleGetStarted}
                    className="btn btn-primary"
                    style={{
                        fontSize: '1.2rem',
                        padding: '16px 48px',
                        borderRadius: '50px',
                        boxShadow: '0 0 30px rgba(138, 43, 226, 0.6)'
                    }}
                >
                    Get Started <ArrowRight size={20} />
                </button>

                {/* Floating Elements Animation */}
                <div style={{ marginTop: '60px', position: 'relative', width: '100%', height: '200px' }}>
                    <div className="glass-card" style={{
                        position: 'absolute', left: '10%', top: '20%',
                        width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'float 6s ease-in-out infinite'
                    }}>
                        <Box size={32} color="var(--color-accent)" />
                    </div>
                    <div className="glass-card" style={{
                        position: 'absolute', right: '15%', top: '0%',
                        width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'float 8s ease-in-out infinite',
                        animationDelay: '1s'
                    }}>
                        <Scan size={40} color="#ff0055" />
                    </div>
                    <div className="glass-card" style={{
                        position: 'absolute', left: '40%', bottom: '0%',
                        width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'float 7s ease-in-out infinite',
                        animationDelay: '0.5s'
                    }}>
                        <Mic size={36} color="#00ff66" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '40px 20px', background: 'rgba(0,0,0,0.2)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Why BoxedUp?</h2>

                    <div style={{ display: 'grid', gap: '24px' }}>
                        <div className="glass-card" style={{ padding: '32px' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '12px',
                                background: 'rgba(138, 43, 226, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <Smartphone size={24} color="#8a2be2" />
                            </div>
                            <h3>Scan & Go</h3>
                            <p>Generate QR codes for your boxes. Scan them later to instantly see what's inside without opening them.</p>
                        </div>

                        <div className="glass-card" style={{ padding: '32px' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '12px',
                                background: 'rgba(0, 210, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <Zap size={24} color="#00d2ff" />
                            </div>
                            <h3>Voice Search</h3>
                            <p>"Where are my winter gloves?" Just ask. Find any item in your inventory instantly.</p>
                        </div>

                        <div className="glass-card" style={{ padding: '32px' }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <Cloud size={24} color="#ffffff" />
                            </div>
                            <h3>Cloud Sync</h3>
                            <p>Your inventory is safe in the cloud. Access it from any device, anywhere.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>
                <p>&copy; {new Date().getFullYear()} BoxedUp. Built with ❤️.</p>
                <p>&copy; {new Date().getFullYear()} BoxedUp. Built with ❤️.</p>
            </footer>
        </div>
    );
};

export default Landing;
