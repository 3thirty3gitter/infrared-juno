import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/layout/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import CreateTub from './pages/CreateTub';
import TubsList from './pages/TubsList';
import TubDetails from './pages/TubDetails';
import Scan from './pages/Scan';
import AddItem from './pages/AddItem';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tubs" element={<TubsList />} />
            <Route path="/tubs/:id" element={<TubDetails />} />
            <Route path="/tubs/:id/add" element={<AddItem />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/create" element={<CreateTub />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Navbar />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
