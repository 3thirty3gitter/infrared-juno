import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Search } from 'lucide-react';

const Tags = () => {
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            // Fetch all items to aggregate tags
            // Note: In a large app, this should be a dedicated RPC function or separate table
            const { data: items, error } = await supabase
                .from('items')
                .select('tags');

            if (error) throw error;

            const tagCounts = {};
            items.forEach(item => {
                if (item.tags && Array.isArray(item.tags)) {
                    item.tags.forEach(t => {
                        const normalized = t.trim();
                        if (normalized) {
                            tagCounts[normalized] = (tagCounts[normalized] || 0) + 1;
                        }
                    });
                }
            });

            // Convert to array and sort by count desc
            const sortedTags = Object.entries(tagCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count);

            setTags(sortedTags);

        } catch (error) {
            console.error("Error fetching tags:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: '16px' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <h1 style={{ marginBottom: '24px' }}>Tags Manager</h1>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading tags...</p>
            ) : tags.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '32px' }}>
                    <Tag size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
                    <p>No tags found.</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Add tags when creating items to utilize this feature.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                    {tags.map(tag => (
                        <Link
                            key={tag.name}
                            to={`/tubs?q=${encodeURIComponent(tag.name)}`}
                            className="glass-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                margin: 0,
                                textDecoration: 'none',
                                borderLeft: '4px solid var(--color-accent)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Tag size={18} color="var(--color-accent)" />
                                <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tag.name}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                {tag.count} items
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tags;
