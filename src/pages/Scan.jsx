import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import './Scan.css';

const Scan = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        // Initialize scanner only once
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode("reader");
        }

        const startScanning = async () => {
            try {
                await scannerRef.current.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: (viewfinderWidth, viewfinderHeight) => {
                            const minEdgePercentage = 0.7;
                            const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
                            const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
                            return {
                                width: qrboxSize,
                                height: qrboxSize
                            };
                        },
                    },
                    (decodedText) => {
                        console.log("Scan success:", decodedText);
                        handleScan(decodedText);
                    },
                    (errorMessage) => {
                        // ignore frame errors
                    }
                );
                setIsScanning(true);
            } catch (err) {
                console.error("Error starting scanner", err);
                setError("Could not start camera. Please ensure permissions are granted.");
            }
        };

        startScanning();

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(err => console.error("Failed to stop scanner on cleanup", err));
            }
        };
    }, []);

    const handleScan = async (decodedText) => {
        try {
            // Stop scanning first
            await stopScanner();

            // Logic to parse
            try {
                const data = JSON.parse(decodedText);
                if ((data.type === 'container' || data.type === 'tub') && data.id) {
                    navigate(`/containers/${data.id}`);
                } else {
                    alert("Scanned data not recognized: " + decodedText);
                    navigate('/dashboard');
                }
            } catch (e) {
                if (decodedText.includes('http')) {
                    alert("Scanned URL: " + decodedText);
                } else {
                    alert("Scanned: " + decodedText);
                }
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                setIsScanning(false);
            } catch (err) {
                console.error("Error stopping scanner", err);
            }
        }
    };

    const handleClose = async () => {
        await stopScanner();
        navigate('/dashboard');
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'black', zIndex: 200 }}>
            {/* Overlay UI */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 210 }}>
                <button onClick={handleClose} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', padding: '12px', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
            </div>

            <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, textAlign: 'center', zIndex: 210, pointerEvents: 'none' }}>
                <h2 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Scan Container QR</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Align the code within the frame</p>
            </div>

            {/* Camera Viewport */}
            <div id="reader" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}></div>

            {error && (
                <div style={{ position: 'absolute', bottom: '100px', left: '20px', right: '20px', background: 'rgba(255,0,0,0.8)', padding: '16px', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default Scan;
