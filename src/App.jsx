import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/layout/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import CreateContainer from './pages/CreateContainer';
import ContainersList from './pages/ContainersList';
import ContainerDetails from './pages/ContainerDetails';
import Scan from './pages/Scan';
import AddItem from './pages/AddItem';
import Profile from './pages/Profile';
import Tags from './pages/Tags';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UpdatePassword from './pages/UpdatePassword';
import Landing from './pages/Landing';

import InstallPrompt from './components/pwa/InstallPrompt';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-wrapper">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/containers" element={<ProtectedRoute><ContainersList /></ProtectedRoute>} />
            <Route path="/containers/:id" element={<ProtectedRoute><ContainerDetails /></ProtectedRoute>} />
            <Route path="/containers/:id/add" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
            <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreateContainer /></ProtectedRoute>} />
            <Route path="/tags" element={<ProtectedRoute><Tags /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
          </Routes>
          <Navbar />
          <InstallPrompt />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
