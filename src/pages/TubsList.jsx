import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Plus, Search, Mic, ArrowLeft, CheckSquare, Square, Printer, X } from 'lucide-react';
import { getVariantIcon } from '../constants/tubVariants';
import PrintModal from '../components/tubs/PrintModal';
import QRCode from 'qrcode';

const TubsList = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [tubs, setTubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    // Selection Mode
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Print Modal (Batch)
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [printData, setPrintData] = useState([]); // Array of { tub, qrUrl }

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
            setTubs([
                { id: 'mock-1', name: 'Christmas Decor', description: 'Ornaments and lights', location: 'Garage', color: '#ff0055', icon: 'box' },
                { id: 'mock-2', name: 'Camping Gear', description: 'Tents, sleeping bags', location: 'Attic', color: '#00ccff', icon: 'backpack' },
                { id: 'mock-3', name: 'Tools', description: 'Drills, hammers, nails', location: 'Basement', color: '#8a2be2', icon: 'bin' },
                { id: 'mock-4', name: 'Winter Clothes', description: 'Coats, scarves, gloves', location: 'Closet', color: '#ffffff', icon: 'suitcase' },
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

    const toggleSelection = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
            if (newSet.size === 0) setIsSelectionMode(false);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleLongPress = (id) => {
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            toggleSelection(id);
        }
    };

    const prepareBatchPrint = async () => {
        // Collect selected tubs
        const selected = tubs.filter(t => selectedIds.has(t.id));

        // Generate QRs for all
        const batchData = await Promise.all(selected.map(async (tub) => {
            const qrContent = JSON.stringify({ type: 'tub', id: tub.id, name: tub.name });
            const url = await QRCode.toDataURL(qrContent, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } });
            return { tub, qrUrl: url };
        }));

        setPrintData(batchData);
        setIsPrintModalOpen(true);
    };

    const filteredTubs = tubs.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: '16px' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                {isSelectionMode ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                        <button onClick={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }} className="btn btn-ghost" style={{ padding: 0 }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ margin: 0 }}>{selectedIds.size} Selected</h2>
                    </div>
                ) : (
                    <>
                        <h1>My Tubs</h1>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setIsSelectionMode(true)} className="btn btn-ghost" style={{ padding: '8px' }}>
                                <CheckSquare size={20} />
                            </button>
                            <Link to="/create" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                                <Plus size={18} /> New
                            </Link>
                        </div>
                    </>
                )}
            </header>

            {/* Search (Hide in selection mode to avoid confusion?) -> Keep it */}
            {!isSelectionMode && (
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
            )}

            {/* List */}
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
                        filteredTubs.map((tub) => {
                            const VariantIcon = getVariantIcon(tub.icon);
                            const isSelected = selectedIds.has(tub.id);

                            return (
                                <div
                                    key={tub.id}
                                    onClick={(e) => {
                                        if (isSelectionMode) {
                                            e.preventDefault();
                                            toggleSelection(tub.id);
                                        }
                                    }}
                                    style={{ position: 'relative' }}
                                >
                                    <Link
                                        to={isSelectionMode ? '#' : `/tubs/${tub.id}`}
                                        className="glass-card"
                                        style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            border: isSelected ? '1px solid var(--color-accent)' : 'none',
                                            background: isSelected ? 'rgba(0, 210, 255, 0.1)' : undefined
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            {/* Checkbox for Selection Mode */}
                                            {isSelectionMode && (
                                                <div style={{ color: isSelected ? 'var(--color-accent)' : '#666' }}>
                                                    {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                                                </div>
                                            )}

                                            <div style={{
                                                width: '48px', height: '48px',
                                                background: tub.color ? tub.color + '33' : 'rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: `1px solid ${tub.color || 'var(--color-primary)'}`
                                            }}>
                                                <VariantIcon size={24} color={tub.color || 'var(--color-primary)'} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{tub.name}</h3>
                                                <p style={{ fontSize: '0.85rem' }}>
                                                    <span style={{ opacity: 0.7 }}>{tub.location}</span>
                                                </p>
                                            </div>
                                        </div>
                                        {!isSelectionMode && <div style={{ color: 'var(--color-text-muted)' }}>&gt;</div>}
                                    </Link>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Batch Print Action */}
            {isSelectionMode && selectedIds.size > 0 && (
                <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 90 }}>
                    <button
                        onClick={prepareBatchPrint}
                        className="btn btn-primary"
                        style={{ padding: '12px 24px', borderRadius: '50px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Printer size={20} /> Print {selectedIds.size} Labels
                    </button>
                </div>
            )}

            <PrintModal
                isOpen={isPrintModalOpen}
                onClose={() => setIsPrintModalOpen(false)}
                items={printData} // Pass array
            />
        </div>
    );
};

export default TubsList;
