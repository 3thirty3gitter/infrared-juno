import React from 'react';
import { Home, Box, PlusCircle, ScanLine, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import useVoiceAssistant from '../pwa/useVoiceAssistant';
import VoiceModal from '../pwa/VoiceModal';
import { Mic } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const { isListening, transcript, error, startListening, stopListening } = useVoiceAssistant();

    // Hide navbar on landing page and login page
    if (location.pathname === '/' || location.pathname === '/login') {
        return null;
    }

    return (
        <>
            <nav className="nav-bar">
                {/* Desktop Logo Area */}
                <div className="desktop-logo" style={{ marginBottom: '40px', padding: '0 32px', width: '100%', display: 'none' }}>
                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>BoxedUp</h1>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Inventory OS</p>
                </div>
                <style>{`
                    @media (min-width: 768px) {
                        .desktop-logo { display: block !important; }
                    }
                `}</style>

                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Home size={24} />
                    <span>Home</span>
                </NavLink>

                <NavLink to="/containers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Box size={24} />
                    <span>Containers</span>
                </NavLink>

                {/* FAB Replacement for Desktop or Extra Item? 
                   On Mobile, FAB is floating. Here we put Voice in the nav flow. 
                */}

                <div className="voice-mic-container">
                    <button
                        onClick={startListening}
                        className="fab-voice"
                    >
                        <Mic size={28} />
                    </button>
                    <span className="desktop-only-text">Voice Search</span>
                </div>

                <NavLink to="/create" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <PlusCircle size={24} />
                    <span>Add</span>
                </NavLink>

                <NavLink to="/scan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <ScanLine size={24} />
                    <span>Scan</span>
                </NavLink>

                <div style={{ flex: 1 }}></div>

                <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <User size={24} />
                    <span>Profile</span>
                </NavLink>
            </nav>

            <VoiceModal
                isOpen={isListening}
                onClose={stopListening}
                isListening={isListening}
                transcript={transcript}
                error={error}
            />
        </>
    );
};

export default Navbar;
