import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

const CreateTub = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        color: '#8a2be2',
        icon: 'box'
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
            navigate('/tubs');
        } catch (err) {
            console.error(err);
            alert('Error creating tub: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: '16px' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <h1>Create New Tub</h1>

            <form onSubmit={handleSubmit}>
                <div className="glass-card">
                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Tub Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Christmas Decor, Camping Gear"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        autoFocus
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
                    <Save size={20} /> {loading ? 'Creating...' : 'Create Tub'}
                </button>
            </form>
        </div>
    );
};

export default CreateTub;
