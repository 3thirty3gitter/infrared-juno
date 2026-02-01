import React, { useState } from 'react';
import { X, Printer, ShoppingCart, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrintModal = ({ isOpen, onClose, tub, qrUrl }) => {
    const [step, setStep] = useState('initial'); // 'initial', 'buy', 'format'
    const [format, setFormat] = useState('single'); // 'single', '5160', '22806'

    if (!isOpen) return null;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');

        let css = `
            body { font-family: sans-serif; text-align: center; }
            .label-single { 
                border: 2px solid #000; 
                padding: 20px; 
                width: 300px; 
                margin: 40px auto; 
                border-radius: 12px;
                page-break-inside: avoid;
            }
            .label-5160 {
                width: 2.625in;
                height: 1in;
                padding: 0.1in;
                float: left;
                text-align: center;
                overflow: hidden;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                font-size: 10px;
            }
            /* Avery 5160 Page Layout */
            .page-5160 {
                width: 8.5in;
                margin: 0 auto;
            }
            
            /* Print Utilities */
            @media print {
                @page { margin: 0.5in; }
                button { display: none; }
            }
        `;

        let content = '';

        if (format === 'single') {
            content = `
                <div class="label-single">
                    <h1>${tub?.name}</h1>
                    <p>${tub?.description || ''}</p>
                    <img src="${qrUrl}" width="200" style="display:block; margin: 10px auto;" />
                    <small>ID: ${tub?.id?.slice(0, 8)}...</small>
                </div>
            `;
        } else if (format === '5160') {
            // 30 labels per sheet
            const labelContent = `
                <div class="label-5160">
                    <img src="${qrUrl}" width="60" height="60" />
                    <div style="text-align:left">
                        <strong style="font-size:12px; display:block;">${tub?.name}</strong>
                        <span>${tub?.id?.slice(0, 6)}</span>
                    </div>
                </div>
             `;
            content = `<div class="page-5160">${labelContent.repeat(30)}</div>`;
        } else if (format === '22806') {
            // Square 2x2
            css += `
                .label-22806 {
                    width: 2in;
                    height: 2in;
                    float: left;
                    border: 1px dashed #eee; /* Helper for view, removed in real usually */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    padding: 5px;
                }
                .page-22806 { width: 8.5in; }
            `;
            const labelContent = `
                <div class="label-22806">
                     <strong style="margin-bottom:5px; font-size: 10px;">${tub?.name}</strong>
                     <img src="${qrUrl}" width="120" height="120" />
                </div>
            `;
            content = `<div class="page-22806">${labelContent.repeat(12)}</div>`;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Label - ${tub?.name}</title>
                    <style>${css}</style>
                </head>
                <body>
                    ${content}
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="glass-card" style={{
                width: '100%', maxWidth: '500px', margin: '20px',
                background: '#1a1a2e', position: 'relative', overflow: 'hidden'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', color: 'white' }}>
                    <X size={24} />
                </button>

                {/* --- INITIAL STEP --- */}
                {step === 'initial' && (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '24px' }}>Print Label</h2>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <button
                                onClick={() => setStep('buy')}
                                className="glass-card"
                                style={{
                                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <div style={{ background: 'var(--color-accent)', padding: '12px', borderRadius: '50%', color: 'black' }}>
                                    <ShoppingCart size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'white' }}>I need to buy labels</h3>
                                    <p style={{ fontSize: '0.85rem', margin: 0 }}>View recommended supplies</p>
                                </div>
                                <ChevronRight size={20} color="gray" />
                            </button>

                            <button
                                onClick={() => setStep('format')}
                                className="glass-card"
                                style={{
                                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <div style={{ background: 'var(--color-primary)', padding: '12px', borderRadius: '50%', color: 'white' }}>
                                    <Printer size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'white' }}>I have labels</h3>
                                    <p style={{ fontSize: '0.85rem', margin: 0 }}>Select format and print</p>
                                </div>
                                <ChevronRight size={20} color="gray" />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- BUY STEP --- */}
                {step === 'buy' && (
                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                            <button onClick={() => setStep('initial')} style={{ background: 'transparent', color: 'white', padding: 0 }}><ArrowLeft size={20} /></button>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Recommended Labels</h2>
                        </div>

                        <div style={{ display: 'grid', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
                            <a href="https://www.amazon.ca/s?k=avery+22806" target="_blank" rel="noopener noreferrer" className="glass-card" style={{ display: 'block', padding: '16px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <h4 style={{ color: 'var(--color-accent)', marginBottom: '4px' }}>Square 2" x 2" (Best)</h4>
                                <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Avery 22806 or Compatible. Perfect for QR codes.</p>
                            </a>
                            <a href="https://www.amazon.ca/s?k=avery+5160" target="_blank" rel="noopener noreferrer" className="glass-card" style={{ display: 'block', padding: '16px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <h4 style={{ color: 'white', marginBottom: '4px' }}>Standard Address 1" x 2-5/8"</h4>
                                <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Avery 5160. Cost effective, widely available.</p>
                            </a>
                            <a href="https://www.amazon.ca/s?k=brother+qld+printer" target="_blank" rel="noopener noreferrer" className="glass-card" style={{ display: 'block', padding: '16px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <h4 style={{ color: 'white', marginBottom: '4px' }}>Thermal Printers</h4>
                                <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Brother QL series. Professional, no ink needed.</p>
                            </a>
                        </div>

                        <button onClick={() => setStep('format')} className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                            Skip to Print
                        </button>
                    </div>
                )}

                {/* --- FORMAT STEP --- */}
                {step === 'format' && (
                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                            <button onClick={() => setStep('initial')} style={{ background: 'transparent', color: 'white', padding: 0 }}><ArrowLeft size={20} /></button>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Select Format</h2>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer', marginBottom: '8px', border: format === 'single' ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
                                <input type="radio" name="format" checked={format === 'single'} onChange={() => setFormat('single')} style={{ width: '20px', height: '20px' }} />
                                <div>
                                    <strong style={{ display: 'block' }}>Single Large Label</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Best for plain paper or thermal</span>
                                </div>
                            </label>

                            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer', marginBottom: '8px', border: format === '22806' ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
                                <input type="radio" name="format" checked={format === '22806'} onChange={() => setFormat('22806')} style={{ width: '20px', height: '20px' }} />
                                <div>
                                    <strong style={{ display: 'block' }}>2" x 2" Square (Page)</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Avery 22806 (12 per sheet)</span>
                                </div>
                            </label>

                            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer', border: format === '5160' ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
                                <input type="radio" name="format" checked={format === '5160'} onChange={() => setFormat('5160')} style={{ width: '20px', height: '20px' }} />
                                <div>
                                    <strong style={{ display: 'block' }}>Address Label (Page)</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Avery 5160 (30 per sheet)</span>
                                </div>
                            </label>
                        </div>

                        <button onClick={handlePrint} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                            <Printer size={20} style={{ marginRight: '8px' }} />
                            Print Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrintModal;
