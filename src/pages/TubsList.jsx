import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useSearchParams } from 'react-router-dom';
import { Box, Plus, Search, Mic } from 'lucide-react';

const TubsList = () => {
    const [searchParams] = useSearchParams();
    const [tubs, setTubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        fetchTubs();
    }, []);

    const fetchTubs = async () => {
        try {
            const { data, error } = await supabase
                .from('tubs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTubs(data || []);
        } catch (error) {
            console.warn("DEMO MODE: Using mock tubs", error);
            // Mock data for dev if no connection
            setTubs([
                { id: 'mock-1', name: 'Christmas Decor', description: 'Ornaments and lights', location: 'Garage', color: '#ff0055' },
                { id: 'mock-2', name: 'Camping Gear', description: 'Tents, sleeping bags', location: 'Attic', color: '#00ccff' },
                { id: 'mock-3', name: 'Tools', description: 'Drills, hammers, nails', location: 'Basement', color: '#8a2be2' },
                { id: 'mock-4', name: 'Winter Clothes', description: 'Coats, scarves, gloves', location: 'Closet', color: '#ffffff' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.onresult = (event) => {
                setSearchTerm(event.results[0][0].transcript);
            };
            recognition.start();
        } else {
            alert("Voice search not supported in this browser.");
        }
    };

    const filteredTubs = tubs.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>My Tubs</h1>
                <Link to="/create" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                    <Plus size={18} /> New
                </Link>
            </header>

            {/* Search */}
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', marginBottom: '24px' }}>
                <Search size={20} color="var(--color-text-muted)" />
                <input
                    type="text"
                    placeholder="Filter tubs..."
                    style={{ margin: 0, border: 'none', background: 'transparent', padding: 0 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={startListening} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer' }}>
                    <Mic size={20} />
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading storage...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredTubs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.7 }}>
                            <Box size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
                            <p>No tubs found.</p>
                            <Link to="/create" className="btn btn-ghost" style={{ marginTop: '8px' }}>Create one now</Link>
                        </div>
                    ) : (
                        filteredTubs.map((tub) => (
                            <Link key={tub.id} to={`/tubs/${tub.id}`} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '48px', height: '48px',
                                        background: tub.color ? tub.color + '33' : 'rgba(255,255,255,0.1)', // 33 is ~20% opacity
                                        borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: `1px solid ${tub.color || 'var(--color-primary)'}`
                                    }}>
                                        <Box size={24} color={tub.color || 'var(--color-primary)'} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{tub.name}</h3>
                                        <p style={{ fontSize: '0.85rem' }}>
                                            <span style={{ opacity: 0.7 }}>{tub.location}</span>
                                            {tub.description && <span style={{ opacity: 0.5 }}> • {tub.description.substring(0, 20)}{tub.description.length > 20 ? '...' : ''}</span>}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ color: 'var(--color-text-muted)' }}>&gt;</div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default TubsList;
