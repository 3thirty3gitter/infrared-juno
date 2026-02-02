import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import InstallPrompt from '../pwa/InstallPrompt';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Outlet />
            <Navbar />
            <InstallPrompt />
        </div>
    );
};

export default MainLayout;
