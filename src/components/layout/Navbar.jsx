import React from 'react';
import { Home, Box, PlusCircle, ScanLine, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="nav-bar">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={24} />
                <span>Home</span>
            </NavLink>

            <NavLink to="/tubs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Box size={24} />
                <span>Tubs</span>
            </NavLink>

            <div style={{ width: '40px' }}></div> {/* Spacer for FAB */}

            <NavLink to="/create" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <PlusCircle size={24} />
                <span>Add</span>
            </NavLink>

            <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <User size={24} />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default Navbar;
