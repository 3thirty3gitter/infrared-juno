import React, { useEffect } from 'react';
import { Mic, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const VoiceModal = ({ isOpen, onClose, isListening, transcript, error }) => {
    if (!isOpen) return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)'
        }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '8px',
                    color: 'white'
                }}
            >
                <X size={24} />
            </button>

            <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: isListening ? 'rgba(138, 43, 226, 0.2)' : 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px',
                position: 'relative'
            }}>
                {/* Ripple Effect */}
                {isListening && (
                    <>
                        <div className="ripple ripple-1"></div>
                        <div className="ripple ripple-2"></div>
                        <style>{`
                            @keyframes ripple {
                                0% { transform: scale(1); opacity: 0.8; }
                                100% { transform: scale(2.5); opacity: 0; }
                            }
                            .ripple {
                                position: absolute;
                                width: 100%; height: 100%;
                                border-radius: 50%;
                                border: 2px solid var(--color-primary);
                                animation: ripple 2s infinite linear;
                            }
                            .ripple-2 { animation-delay: 1s; }
                        `}</style>
                    </>
                )}

                <Mic size={48} color={isListening ? 'var(--color-accent)' : 'gray'} />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 600 }}>
                {isListening ? "Listening..." : "Tap mic to speak"}
            </h2>

            <p style={{
                fontSize: '1.2rem',
                color: isListening ? 'white' : 'gray',
                maxWidth: '80%',
                textAlign: 'center',
                minHeight: '60px'
            }}>
                {error ? <span style={{ color: '#ff4444' }}>{error}</span> : (transcript || "Try 'Where is my drill?'")}
            </p>

        </div>,
        document.body
    );
};

export default VoiceModal;
