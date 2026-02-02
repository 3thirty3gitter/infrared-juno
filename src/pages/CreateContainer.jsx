import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { TUB_VARIANTS } from '../constants/tubVariants';

const CreateContainer = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        color: '#8a2be2',
        icon: 'bin'
    });

    const colors = ['#8a2be2', '#ff0055', '#00ccff', '#ffcc00', '#00ff66', '#ffffff'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('You must be logged in');

        setLoading(true);
        try {
            const { error } = await supabase.from('tubs').insert([
                {
                    user_id: user.id,
                    name: formData.name,
                    description: formData.description,
                    location: formData.location,
                    color: formData.color,
                    icon: formData.icon
                }
            ]);

            if (error) throw error;
            navigate('/containers');
        } catch (err) {
            console.error(err);
            alert('Error creating container: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: '16px' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <h1>Create New Container</h1>

            <form onSubmit={handleSubmit}>
                <div className="glass-card">
                    {/* Storage Type Selector */}
                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '12px' }}>Storage Type</label>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px', marginBottom: '24px'
                    }}>
                        {Object.values(TUB_VARIANTS).map((variant) => {
                            const Icon = variant.icon;
                            const isSelected = formData.icon === variant.id;
                            return (
                                <div
                                    key={variant.id}
                                    onClick={() => setFormData({ ...formData, icon: variant.id })}
                                    style={{
                                        background: isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                        border: isSelected ? '2px solid var(--color-accent)' : '1px solid transparent',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon size={24} color={isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)'} />
                                    <span style={{ fontSize: '0.75rem', color: isSelected ? 'white' : 'var(--color-text-muted)', textAlign: 'center' }}>
                                        {variant.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Container Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Christmas Decor, Camping Gear"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Location</label>
                    <input
                        type="text"
                        placeholder="e.g. Garage Shelf A, Attic"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />

                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Description</label>
                    <textarea
                        placeholder="What's usually in here?"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>Color Tag</label>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                        {colors.map(c => (
                            <div
                                key={c}
                                onClick={() => setFormData({ ...formData, color: c })}
                                style={{
                                    width: '32px', height: '32px', borderRadius: '50%', background: c,
                                    cursor: 'pointer',
                                    border: formData.color === c ? '3px solid white' : '1px solid rgba(255,255,255,0.2)',
                                    boxShadow: formData.color === c ? '0 0 10px ' + c : 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                    disabled={loading}
                >
                    <Save size={20} /> {loading ? 'Creating...' : 'Create Container'}
                </button>
            </form>
        </div>
    );
};

export default CreateContainer;
