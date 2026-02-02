import React, { useState } from 'react';
import { X, Printer, ShoppingCart, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { getVariantIcon, getVariantLabel } from '../../constants/tubVariants';

const PrintModal = ({ isOpen, onClose, items, tub, qrUrl }) => {
    const [step, setStep] = useState('initial');
    const [format, setFormat] = useState('single');

    // Normalize input: If 'items' (batch) provided, use it. Else use single 'tub'+'qrUrl'.
    const printItems = items && items.length > 0 ? items : (tub ? [{ tub, qrUrl }] : []);

    if (!isOpen) return null;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');

        // --- Helper to Generate HTML for One Item ---
        const generateLabelHtml = (item, type) => {
            const { tub, qrUrl } = item;
            const VariantIcon = getVariantIcon(tub?.icon);
            const variantLabel = getVariantLabel(tub?.icon).toUpperCase();

            const iconSvg = renderToStaticMarkup(<VariantIcon size={40} strokeWidth={1.5} color="#000" />);
            const iconSvgSmall = renderToStaticMarkup(<VariantIcon size={24} strokeWidth={1.5} color="#000" />);

            if (type === 'single') {
                return `
                    <div class="label-single" style="page-break-after: always;">
                        <div style="margin-bottom:8px;">${iconSvg}</div>
                        <span style="font-size:0.75rem; letter-spacing:1px; display:block;">${variantLabel}</span>
                        <h1 style="margin:4px 0 10px; font-size:1.5rem;">${tub?.name}</h1>
                        <p style="margin:0 0 10px; font-size:0.9rem;">${tub?.description || ''}</p>
                        <img src="${qrUrl}" width="180" style="display:block; margin: 0 auto;" />
                        <small style="display:block; margin-top:8px; font-family:monospace;">ID: ${tub?.id?.slice(0, 8)}</small>
                    </div>
                `;
            } else if (type === '5160') {
                return `
                <div class="label-5160">
                    <img src="${qrUrl}" width="60" height="60" />
                    <div style="text-align:left">
                         <div style="display:flex; align-items:center; gap:4px; margin-bottom:2px;">
                            ${renderToStaticMarkup(<VariantIcon size={12} strokeWidth={2} color="#000" />)}
                            <span style="font-size:8px; font-weight:bold;">${variantLabel}</span>
                         </div>
                        <strong style="font-size:11px; display:block; line-height:1.1;">${tub?.name}</strong>
                        <span style="font-size:8px; font-family:monospace;">${tub?.id?.slice(0, 6)}</span>
                    </div>
                </div>
               `;
            } else if (type === '22806') {
                return `
                <div class="label-22806">
                     <div style="margin-bottom:2px;">${iconSvgSmall}</div>
                     <span style="font-size:8px; letter-spacing:0.5px;">${variantLabel}</span>
                     <strong style="margin:2px 0 4px; font-size: 11px; text-align:center; line-height:1.1;">${tub?.name}</strong>
                     <img src="${qrUrl}" width="100" height="100" />
                </div>
               `;
            } else if (type === 'thermal-4x6') {
                return `
                <div class="label-thermal-4x6">
                     <div style="margin-bottom:8px;">${iconSvg}</div>
                     <span style="font-size:0.9rem; letter-spacing:1px; display:block;">${variantLabel}</span>
                     <h1 style="margin:8px 0 12px; font-size:2.5rem; line-height:1.1;">${tub?.name}</h1>
                     <p style="margin:0 0 16px; font-size:1.2rem;">${tub?.description || ''}</p>
                     <img src="${qrUrl}" width="250" height="250" />
                     <small style="display:block; margin-top:12px; font-family:monospace; font-size: 1rem;">ID: ${tub?.id?.slice(0, 8)}</small>
                </div>
               `;
            } else if (type === 'thermal-3x2') {
                return `
                <div class="label-thermal-3x2">
                     <div style="display:flex; align-items:center; gap:8px; justify-content:center; margin-bottom:4px;">
                        ${renderToStaticMarkup(<VariantIcon size={20} strokeWidth={2} color="#000" />)}
                        <span style="font-size:0.7rem; font-weight:bold;">${variantLabel}</span>
                     </div>
                     <h2 style="margin:2px 0; font-size:1.1rem; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;">${tub?.name}</h2>
                     <img src="${qrUrl}" width="80" height="80" style="margin: 2px 0;" />
                     <small style="display:block; font-family:monospace; font-size: 0.7rem;">${tub?.id?.slice(0, 8)}</small>
                </div>
               `;
            } else if (type === 'thermal-2.25x1.25') {
                return `
                <div class="label-thermal-small">
                     <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                         <div style="text-align:left; flex:1; overflow:hidden;">
                            <strong style="display:block; font-size:0.8rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${tub?.name}</strong>
                            <span style="font-size:0.6rem; font-family:monospace;">${tub?.id?.slice(0, 6)}</span>
                         </div>
                         <img src="${qrUrl}" width="60" height="60" />
                     </div>
                </div>
               `;
            }
        };

        let css = `
            body { font-family: sans-serif; text-align: center; margin: 0; padding: 0; }
            
            .label-single { 
                border: 2px solid #000; 
                padding: 20px; 
                width: 300px; 
                margin: 40px auto; 
                border-radius: 12px;
                page-break-inside: avoid;
            }
            
            /* Avery 5160: 30 per sheet (3x10). 1" x 2-5/8" */
            /* Sheet: 8.5 x 11 */
            /* Margins: Top 0.5", Bottom 0.5", Left 0.19", Right 0.19" */
            /* Spacing: H-Gap 0.12", V-Gap 0 */
            .page-5160 {
                width: 8.5in;
                margin: 0 auto;
                padding-top: 0.5in;
                padding-left: 0.19in;
                padding-right: 0.19in;
                box-sizing: border-box; 
                /* Ensures grid wraps correctly */
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;
            }
            .label-5160 {
                width: 2.625in;
                height: 1in;
                /* float: left; - Flexbox is safer */
                text-align: center;
                overflow: hidden;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                font-size: 10px;
                /* Avery Gaps - Right margin usually 0.12in between cols */
                margin-right: 0.12in; 
                margin-bottom: 0; 
            }
            /* Reset margin for 3rd column to fit? Avery cols are 2.625 * 3 = 7.875. + 0.24 gap = 8.115. Page 8.5. Fits. */
            /* We can just let it flow. If printer scale 100%, it should hit. */

            /* Avery 22806: 12 per sheet (3x4). 2" x 2" */
            /* Margins: Top 1.5", Bottom 1.5"? No, usually tailored. */
            .page-22806 { 
                width: 8.5in; 
                padding-top: 0.6in; /* Verified approx */
                padding-left: 0.6in;
                margin: 0 auto;
                display: flex;
                flex-wrap: wrap;
            }
            .label-22806 {
                width: 2in;
                height: 2in;
                border: 1px dashed #eee; 
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                padding: 5px;
                margin-right: 0.6in; /* Gap */
                margin-bottom: 0.6in; /* Gap */
            }
            
            /* Thermal 4x6 */
            .label-thermal-4x6 {
                width: 4in;
                height: 6in;
                padding: 0.2in;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                page-break-after: always;
                border: 1px dotted #ccc; /* Helper border, might want to remove for print or keep as guide */
                margin: 0 auto;
            }

            /* Thermal 3x2 */
            .label-thermal-3x2 {
                width: 3in;
                height: 2in;
                padding: 0.1in;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                page-break-after: always;
                overflow: hidden;
            }

            /* Thermal 2.25x1.25 */
            .label-thermal-small {
                width: 2.25in;
                height: 1.25in;
                padding: 0.05in;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                page-break-after: always;
                overflow: hidden;
            }

            /* Print Utilities */
            @media print {
                @page { margin: 0; } 
                body { margin: 0; padding: 0; }
                .label-single, .label-thermal-4x6, .label-thermal-3x2, .label-thermal-small {
                    border: none; /* Remove guide borders */
                    margin: 0;
                    page-break-after: always;
                }
                button { display: none; }
            }
        `;

        // Generate Loop
        let generatedLabels = printItems.map(item => generateLabelHtml(item, format)).join('');

        let content = '';
        if (format === 'single') {
            content = generatedLabels; // just breaks
        } else if (format === '5160') {
            content = `<div class="page-5160">${generatedLabels}</div>`;
        } else if (format === '22806') {
            content = `<div class="page-22806">${generatedLabels}</div>`;
        } else {
            // All thermal / single types just dump the labels directly
            content = generatedLabels;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Labels (${printItems.length})</title>
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
                        <h2 style={{ marginBottom: '24px' }}>Print Label{printItems.length > 1 ? 's' : ''}</h2>

                        {printItems.length > 1 && (
                            <p style={{ color: 'var(--color-accent)', marginBottom: '16px' }}>
                                {printItems.length} items selected for batch printing.
                            </p>
                        )}

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
                            {printItems.length > 1 && (
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-accent)', marginBottom: '12px', background: 'rgba(0,255,255,0.1)', padding: '8px', borderRadius: '8px' }}>
                                    Batch Mode: {printItems.length} items will be filtered onto the selected template.
                                </div>
                            )}

                            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer', marginBottom: '8px', border: format === 'single' ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
                                <input type="radio" name="format" checked={format === 'single'} onChange={() => setFormat('single')} style={{ width: '20px', height: '20px' }} />
                                <div>
                                    <strong style={{ display: 'block' }}>Single Large Label</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Best for plain paper or thermal</span>
                                </div>
                            </label>

                            <h4 style={{ marginTop: '16px', marginBottom: '8px', color: 'var(--color-primary)' }}>Thermal / Single</h4>

                            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer', marginBottom: '8px', border: format === 'thermal-4x6' ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
                                <input type="radio" name="format" checked={format === 'thermal-4x6'} onChange={() => setFormat('thermal-4x6')} style={{ width: '20px', height: '20px' }} />
                                <div>
                                    <strong style={{ display: 'block' }}>4" x 6" Shipping</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Standard large thermal label</span>
                                </div>
                            </label>

                            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer', marginBottom: '8px', border: format === 'thermal-3x2' ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
                                <input type="radio" name="format" checked={format === 'thermal-3x2'} onChange={() => setFormat('thermal-3x2')} style={{ width: '20px', height: '20px' }} />
                                <div>
                                    <strong style={{ display: 'block' }}>3" x 2" Medium</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Common for bin labeling</span>
                                </div>
                            </label>

                            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer', marginBottom: '8px', border: format === 'thermal-2.25x1.25' ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
                                <input type="radio" name="format" checked={format === 'thermal-2.25x1.25'} onChange={() => setFormat('thermal-2.25x1.25')} style={{ width: '20px', height: '20px' }} />
                                <div>
                                    <strong style={{ display: 'block' }}>2.25" x 1.25" Small</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Compact barcode label</span>
                                </div>
                            </label>

                            <h4 style={{ marginTop: '16px', marginBottom: '8px', color: 'var(--color-primary)' }}>Page Sheets</h4>

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

                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.8rem', color: '#ddd' }}>
                            <strong>⚠️ Important:</strong> Set print margins to "None" and Scale to "100%" for precise alignment.
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
