import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Download, LogOut, Settings, User, Upload, Tag, Edit2, Save as SaveIcon, X, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ tubs: 0, items: 0 });
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({ full_name: '', username: '' });
    const [editing, setEditing] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Check if demo user
            if (user?.id === 'demo-user') {
                setStats({ tubs: 4, items: 12 });
                setProfile({ full_name: 'Demo User', username: 'demo' });
                return;
            }

            // Fetch Stats
            const { count: tubsCount } = await supabase.from('tubs').select('*', { count: 'exact', head: true });
            const { count: itemsCount } = await supabase.from('items').select('*', { count: 'exact', head: true });
            setStats({ tubs: tubsCount || 0, items: itemsCount || 0 });

            // Fetch Profile
            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
            } else if (error && error.code === 'PGRST116') {
                // Profile doesn't exist
                setProfile({ full_name: '', username: user.email?.split('@')[0] });
            }

        } catch (e) {
            console.warn("Error fetching profile data", e);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (user?.id === 'demo-user') {
                setEditing(false);
                setLoading(false);
                return;
            }

            const updates = {
                id: user.id,
                full_name: profile.full_name,
                username: profile.username,
                updated_at: new Date()
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;
            setEditing(false);
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackup = async () => {
        setLoading(true);
        try {
            let tubs = [];
            let items = [];

            if (user?.id === 'demo-user') {
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

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!window.confirm("This will merge the backup data into your account. Existing items with same IDs will be updated. Continue?")) {
            e.target.value = null; // Reset
            return;
        }

        setLoading(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const json = JSON.parse(event.target.result);

                if (!json.tubs || !json.items) {
                    throw new Error("Invalid backup file format. Missing tubs or items.");
                }

                const tubsToUpsert = json.tubs.map(t => ({ ...t, user_id: user.id }));
                const itemsToUpsert = json.items.map(i => ({ ...i, user_id: user.id }));

                const { error: tubError } = await supabase.from('tubs').upsert(tubsToUpsert);
                if (tubError) throw tubError;

                const { error: itemError } = await supabase.from('items').upsert(itemsToUpsert);
                if (itemError) throw itemError;

                alert(`Success! Imported ${tubsToUpsert.length} tubs and ${itemsToUpsert.length} items.`);
                fetchData();

            } catch (err) {
                console.error("Import error:", err);
                alert("Import failed: " + err.message);
            } finally {
                setLoading(false);
                e.target.value = null;
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: '16px' }}>
                <ArrowLeft size={20} /> Back
            </button>
            <h1 style={{ marginBottom: '24px' }}>Profile</h1>

            <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0
                    }}>
                        {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')}
                    </div>

                    {editing ? (
                        <form onSubmit={handleProfileUpdate} style={{ flex: 1 }}>
                            <div style={{ marginBottom: '8px' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={profile.full_name || ''}
                                    onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                    style={{ padding: '8px', marginBottom: '4px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Username</label>
                                <input
                                    type="text"
                                    value={profile.username || ''}
                                    onChange={e => setProfile({ ...profile, username: e.target.value })}
                                    style={{ padding: '8px', marginBottom: 0, background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <button type="submit" className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <SaveIcon size={14} /> Save
                                </button>
                                <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <X size={14} /> Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                                {profile.full_name || user?.email?.split('@')[0]}
                            </h2>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>@{profile.username || user?.email?.split('@')[0]}</p>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', opacity: 0.7 }}>{user?.email}</p>
                        </div>
                    )}
                </div>

                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                    >
                        <Edit2 size={18} />
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.tubs}</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Containers</div>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>{stats.items}</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Items</div>
                </div>
            </div>

            <h3 style={{ marginBottom: '16px', color: 'var(--color-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Data Management</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                <button onClick={handleBackup} className="glass-card btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '16px', margin: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ background: 'rgba(50, 255, 100, 0.1)', padding: '8px', borderRadius: '8px', marginRight: '16px' }}>
                        <Download size={20} color="#32ff64" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600 }}>Download Backup</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Export all data to JSON</div>
                    </div>
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileImport}
                    accept=".json"
                    style={{ display: 'none' }}
                />

                <button onClick={handleImportClick} className="glass-card btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '16px', margin: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ background: 'rgba(50, 150, 255, 0.1)', padding: '8px', borderRadius: '8px', marginRight: '16px' }}>
                        <Upload size={20} color="#3296ff" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600 }}>Import Backup</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Restore from JSON file</div>
                    </div>
                </button>

                <Link to="/tags" className="glass-card btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '16px', margin: 0, border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: 'rgba(255, 150, 50, 0.1)', padding: '8px', borderRadius: '8px', marginRight: '16px' }}>
                        <Tag size={20} color="#ff9632" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600 }}>Manage Tags</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>View and explore tags</div>
                    </div>
                </Link>
            </div>

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
