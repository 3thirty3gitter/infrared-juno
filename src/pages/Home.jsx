import React, { useEffect, useState } from 'react';
import { Box, Scan, Search, Package, Mic, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ tubs: 0, items: 0 });
    const [recentTubs, setRecentTubs] = useState([]);
    const [expiringItems, setExpiringItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch Tubs Count & Recent
            const { data: tubsData, error: tubsError, count: tubsCount } = await supabase
                .from('tubs')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .limit(3);

            if (tubsError) throw tubsError;

            // Fetch Items Count
            const { count: itemsCount, error: itemsError } = await supabase
                .from('items')
                .select('*', { count: 'exact', head: true });

            if (itemsError) throw itemsError;

            // Fetch Expiring Items
            const { data: expiringData } = await supabase
                .from('items')
                .select('*')
                .not('expiry_date', 'is', null)
                .order('expiry_date', { ascending: true })
                .limit(5);

            setStats({
                tubs: tubsCount || 0,
                items: itemsCount || 0
            });
            setRecentTubs(tubsData || []);
            setExpiringItems(expiringData || []);

        } catch (error) {
            console.warn("Error fetching dashboard data, using defaults/mocks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/tubs?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchTerm(transcript);
                // Optional: Auto-navigate on voice result
                // navigate(`/tubs?q=${encodeURIComponent(transcript)}`);
            };
            recognition.start();
        } else {
            alert("Voice search not supported in this browser.");
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ marginBottom: '4px' }}>BoxedUp</h1>
                    {user && <p style={{ fontSize: '0.9rem' }}>Welcome back, {user.email?.split('@')[0]}</p>}
                </div>
                <Link to="/profile" className="glass-card" style={{ padding: '4px', margin: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {user?.email?.[0].toUpperCase() || 'U'}
                    </div>
                </Link>
            </header>

            {/* Search Bar */}
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <Search size={20} color="var(--color-text-muted)" />
                <input
                    type="text"
                    placeholder="Search items, tubs, tags..."
                    style={{ margin: 0, border: 'none', background: 'transparent', padding: 0 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                />
                <button onClick={startListening} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer' }}>
                    <Mic size={20} />
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <Link to="/tubs" className="glass-card" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '4px' }}>{stats.tubs}</h2>
                    <p>Active Tubs</p>
                </Link>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', color: '#ff00ff', marginBottom: '4px' }}>{stats.items}</h2>
                    <p>Total Items</p>
                </div>
            </div>

            {/* Recent Tubs Section */}
            <section style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2>Recent Tubs</h2>
                    <Link to="/tubs" style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>View All</Link>
                </div>

                {loading ? (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Loading dashboard...</p>
                ) : recentTubs.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '32px' }}>
                        <p>No tubs yet.</p>
                        <Link to="/create" className="btn btn-primary" style={{ marginTop: '12px' }}>Create First Tub</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentTubs.map((tub) => (
                            <Link key={tub.id} to={`/tubs/${tub.id}`} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '48px', height: '48px',
                                        background: tub.color ? tub.color + '33' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: `1px solid ${tub.color || 'var(--color-primary)'}`
                                    }}>
                                        <Box size={24} color={tub.color || 'var(--color-primary)'} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{tub.name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                            {tub.location}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ color: 'var(--color-text-muted)' }}>&gt;</div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Expiring Items Section */}
            {!loading && expiringItems.length > 0 && (
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
                        <Clock size={20} color="#ffcc00" />
                        <h2>Expiring Soon</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {expiringItems.map((item) => {
                            const daysLeft = Math.ceil((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
                            const isExpired = daysLeft < 0;
                            return (
                                <Link key={item.id} to={`/tubs/${item.tub_id}`} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0, borderLeft: isExpired ? '4px solid #ff4444' : '4px solid #ffcc00' }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '48px', height: '48px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Package size={24} color={isExpired ? '#ff4444' : '#ffcc00'} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.name}</h3>
                                            <p style={{ fontSize: '0.85rem', color: isExpired ? '#ff4444' : '#ffcc00' }}>
                                                {isExpired ? `Expired ${Math.abs(daysLeft)} days ago` : `Expires in ${daysLeft} days`}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ color: 'var(--color-text-muted)' }}>&gt;</div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* FAB for Scan */}
            <Link to="/scan" className="fab">
                <Scan size={28} />
            </Link>
        </div>
    );
};

export default Home;
