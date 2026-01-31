import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import QRCode from 'qrcode';
import { ArrowLeft, Printer, Plus, Package } from 'lucide-react';

const TubDetails = () => {
    const { id } = useParams();
    const [tub, setTub] = useState(null);
    const [items, setItems] = useState([]);
    const [qrUrl, setQrUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTubDetails();
    }, [id]);

    const fetchTubDetails = async () => {
        try {
            // Fetch Tub Info
            const { data: tubData, error: tubError } = await supabase
                .from('tubs')
                .select('*')
                .eq('id', id)
                .single();

            if (tubError) throw tubError;
            setTub(tubData);

            // Generate QR Code
            const qrContent = JSON.stringify({ type: 'tub', id: tubData.id, name: tubData.name });
            // Alternatively use a URL: https://myapp.com/tubs/uuid
            const url = await QRCode.toDataURL(qrContent, { width: 300, margin: 2, color: { dark: tubData.color || '#000000', light: '#ffffff' } });
            setQrUrl(url);

            // Fetch Items (Mock for now or real if exists)
            const { data: itemsData } = await supabase
                .from('items')
                .select('*')
                .eq('tub_id', id);

            if (itemsData) setItems(itemsData);

        } catch (error) {
            console.warn("DEMO MODE: Using mock tub details", error);
            // Mock Data
            const mockTub = {
                id: id,
                name: 'Demo Tub ' + id,
                description: 'This is a demo tub for testing purposes.',
                location: 'Demo Location',
                color: '#8a2be2'
            };
            setTub(mockTub);
            setItems([
                { id: 'i1', name: 'Demo Item 1', description: 'Sample item', image_url: null },
                { id: 'i2', name: 'Demo Item 2', description: 'Another sample', image_url: null },
            ]);

            // Mock QR
            try {
                const qrContent = JSON.stringify({ type: 'tub', id: mockTub.id, name: mockTub.name });
                const url = await QRCode.toDataURL(qrContent, { width: 300, margin: 2, color: { dark: mockTub.color, light: '#ffffff' } });
                setQrUrl(url);
            } catch (e) { console.error("QR Gen Error", e); }

        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <html>
        <head>
          <title>Print QR - ${tub?.name}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            h1 { margin-bottom: 10px; }
            p { color: #666; }
            img { max-width: 100%; height: auto; border: 4px solid #000; border-radius: 12px; }
            .meta { margin-top: 20px; border: 1px solid #ccc; padding: 20px; display: inline-block; }
          </style>
        </head>
        <body>
          <h1>${tub?.name}</h1>
          <p>${tub?.description || ''}</p>
          <img src="${qrUrl}" width="300" />
          <div class="meta">
            <strong>Location:</strong> ${tub?.location || 'N/A'}<br/>
            <small>ID: ${tub?.id}</small>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    if (loading) return <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>Loading...</div>;
    if (!tub) return <div className="container">Tub not found</div>;

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <button onClick={() => window.history.back()} className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: '16px' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <div className="glass-card" style={{
                background: `linear-gradient(to bottom right, rgba(255,255,255,0.1), ${tub.color}22)`,
                borderTop: `4px solid ${tub.color}`
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ marginBottom: '4px' }}>{tub.name}</h1>
                        <p style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{tub.location}</p>
                        <p style={{ marginTop: '8px', opacity: 0.8 }}>{tub.description}</p>
                    </div>
                    <div style={{ background: 'white', padding: '8px', borderRadius: '12px' }}>
                        {qrUrl && <img src={qrUrl} alt="QR Code" style={{ width: '80px', height: '80px', display: 'block' }} />}
                    </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                    <button onClick={handlePrint} className="btn btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                        <Printer size={18} /> Print Label
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 16px' }}>
                <h2>Items in Tub ({items.length})</h2>
                <Link to={`/tubs/${id}/add`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    <Plus size={16} /> Add Item
                </Link>
            </div>

            {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5, border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                    <Package size={48} style={{ marginBottom: '12px' }} />
                    <p>This tub is empty.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                    {items.map(item => (
                        <div key={item.id} className="glass-card" style={{ padding: '12px', marginBottom: 0 }}>
                            {item.image_url ? (
                                <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                            ) : (
                                <div style={{ width: '100%', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Package size={32} color="var(--color-text-muted)" />
                                </div>
                            )}
                            <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{item.name}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.description}</p>
                            {item.tags && item.tags.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                    {item.tags.map(tag => (
                                        <span key={tag} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {item.expiry_date && (
                                <p style={{ fontSize: '0.75rem', color: '#ffcc00', marginTop: '4px' }}>
                                    Expiry: {new Date(item.expiry_date).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default TubDetails;
