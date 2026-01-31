import React from 'react';
import { Box, Scan, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>BoxedUp</h1>
                <div className="glass-card" style={{ padding: '8px', margin: 0, borderRadius: '50%' }}>
                    {/* User Avatar Placeholder */}
                    <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '50%' }}></div>
                </div>
            </header>

            {/* Search Bar */}
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <Search size={20} color="var(--color-text-muted)" />
                <input
                    type="text"
                    placeholder="Search items, tubs, tags..."
                    style={{ margin: 0, border: 'none', background: 'transparent', padding: 0 }}
                />
            </div>

            {/* Quick Stats or Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '4px' }}>12</h2>
                    <p>Active Tubs</p>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', color: '#ff00ff', marginBottom: '4px' }}>154</h2>
                    <p>Total Items</p>
                </div>
            </div>

            {/* Recent Tubs Section */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2>Recent Tubs</h2>
                    <Link to="/tubs" style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>View All</Link>
                </div>

                {/* Dummy Tubs List */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Box size={24} color="var(--color-primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Christmas Decor {i}</h3>
                                <p style={{ fontSize: '0.9rem' }}>Garage • shelf B</p>
                            </div>
                        </div>
                        <div style={{ color: 'var(--color-text-muted)' }}>&gt;</div>
                    </div>
                ))}
            </section>

            {/* FAB for Scan */}
            <Link to="/scan" className="fab">
                <Scan size={28} />
            </Link>
        </div>
    );
};

export default Home;
