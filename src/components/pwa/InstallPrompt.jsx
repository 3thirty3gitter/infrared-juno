import React, { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

        if (isIosDevice && !isStandalone) {
            setIsIOS(true);
            // Small delay to not be annoying immediately
            setTimeout(() => setIsVisible(true), 1000);
        }

        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '20px',
            right: '20px',
            background: 'rgba(20, 20, 40, 0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                        width: '40px', height: '40px', background: 'var(--color-primary)',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {isIOS ? <Share size={20} color="white" /> : <Download size={20} color="white" />}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: 'white' }}>
                            {isIOS ? 'Install for iOS' : 'Install BoxedUp'}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                            Add to Home Screen for the best experience
                        </p>
                    </div>
                </div>
                <button onClick={handleDismiss} style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', padding: '4px' }}>
                    <X size={20} />
                </button>
            </div>

            {isIOS ? (
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
                    <p style={{ margin: 0 }}>
                        Tap the <Share size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> <strong>Share</strong> button in your browser menu and select <strong>"Add to Home Screen"</strong>.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleInstallClick}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '10px', fontSize: '0.95rem' }}
                    >
                        Install Now
                    </button>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default InstallPrompt;
