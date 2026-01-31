import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Download, LogOut, Settings, User } from 'lucide-react';

const Profile = () => {
    const { user, signOut } = useAuth();
    const [stats, setStats] = useState({ tubs: 0, items: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Check if demo user
            if (user?.id === 'demo-user') {
                setStats({ tubs: 4, items: 12 });
                return;
            }

            const { count: tubsCount } = await supabase.from('tubs').select('*', { count: 'exact', head: true });
            const { count: itemsCount } = await supabase.from('items').select('*', { count: 'exact', head: true });
            setStats({ tubs: tubsCount || 0, items: itemsCount || 0 });
        } catch (e) {
            console.warn("Using demo stats", e);
            setStats({ tubs: 4, items: 12 });
        }
    };

    const handleBackup = async () => {
        setLoading(true);
        try {
            let tubs = [];
            let items = [];

            if (user?.id === 'demo-user') {
                // Generate demo data export
                tubs = [
                    { id: 'mock-1', name: 'Christmas Decor', description: 'Ornaments and lights', location: 'Garage', color: '#ff0055' },
                    { id: 'mock-2', name: 'Camping Gear', description: 'Tents, sleeping bags', location: 'Attic', color: '#00ccff' }
                ];
                items = [
                    { id: 'i1', tub_id: 'mock-1', name: 'Lights', description: 'LED strings' },
                    { id: 'i2', tub_id: 'mock-2', name: 'Tent', description: '4-person dome' }
                ];
            } else {
                const { data: tubsData } = await supabase.from('tubs').select('*');
                const { data: itemsData } = await supabase.from('items').select('*');
                tubs = tubsData;
                items = itemsData;
            }

            const backupData = {
                exportDate: new Date().toISOString(),
                user: user.email,
                stats: { totalTubs: tubs.length, totalItems: items.length },
                tubs,
                items
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `boxedup-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Backup failed:", error);
            alert("Backup failed. See console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <h1 style={{ marginBottom: '24px' }}>Profile</h1>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 'bold'
                }}>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{user?.email?.split('@')[0]}</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.tubs}</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Tubs</div>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>{stats.items}</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Items</div>
                </div>
            </div>

            <h3 style={{ marginBottom: '16px', color: 'var(--color-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Data Management</h3>

            <button onClick={handleBackup} className="glass-card btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ background: 'rgba(50, 255, 100, 0.1)', padding: '8px', borderRadius: '8px', marginRight: '16px' }}>
                    <Download size={20} color="#32ff64" />
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600 }}>Download Backup</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Export all data to JSON</div>
                </div>
            </button>

            <h3 style={{ marginBottom: '16px', color: 'var(--color-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Account</h3>

            <button onClick={signOut} className="glass-card btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '16px', color: '#ff4d4d', border: '1px solid rgba(255, 77, 77, 0.2)' }}>
                <div style={{ background: 'rgba(255, 77, 77, 0.1)', padding: '8px', borderRadius: '8px', marginRight: '16px' }}>
                    <LogOut size={20} />
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600 }}>Sign Out</div>
                </div>
            </button>

            <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.3, fontSize: '0.8rem' }}>
                BoxedUp v1.0.0
            </div>
        </div>
    );
};

export default Profile;
