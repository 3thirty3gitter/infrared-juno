import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { X, Camera } from 'lucide-react';

const Scan = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader");

        const startScanning = async () => {
            try {
                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0
                    },
                    (decodedText, decodedResult) => {
                        // Handle success
                        console.log("Scan success:", decodedText);
                        try {
                            // Attempt to parse JSON content
                            const data = JSON.parse(decodedText);
                            if (data.type === 'tub' && data.id) {
                                html5QrCode.stop().then(() => {
                                    navigate(`/tubs/${data.id}`);
                                });
                            } else {
                                alert("Scanned data not recognized as a Tub: " + decodedText);
                            }
                        } catch (e) {
                            // If not JSON, maybe it's just the uuid or a URL?
                            // For now, assume it might be a UUID string if it matches format
                            if (decodedText.includes('http')) {
                                // Try to extract uuid from url if it matches our pattern
                                // e.g. https://.../tubs/<uuid>
                                // For now, simple alert
                                alert("Scanned URL: " + decodedText);
                            } else {
                                alert("Scanned: " + decodedText);
                            }
                        }
                    },
                    (errorMessage) => {
                        // parse error, ignore usually
                    }
                );
                setHasPermission(true);
            } catch (err) {
                console.error("Error starting scanner", err);
                setError("Could not start camera. Please ensure permissions are granted.");
            }
        };

        startScanning();

        return () => {
            // Cleanup
            html5QrCode.stop().catch(err => console.error(err));
            html5QrCode.clear();
        };
    }, [navigate]);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'black', zIndex: 200 }}>
            {/* Overlay UI */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 210 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', padding: '12px' }}>
                    <X size={24} />
                </button>
            </div>

            <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, textAlign: 'center', zIndex: 210, pointerEvents: 'none' }}>
                <h2 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Scan Tub QR</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Align the code within the frame</p>
            </div>

            {/* Camera Viewport */}
            <div id="reader" style={{ width: '100%', height: '100%' }}></div>

            {error && (
                <div style={{ position: 'absolute', bottom: '100px', left: '20px', right: '20px', background: 'rgba(255,0,0,0.8)', padding: '16px', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default Scan;
