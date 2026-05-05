import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Classes from './pages/Classes.jsx';
import Plans from './pages/Plans.jsx';
import Attendance from './pages/Attendance.jsx';
import Payments from './pages/Payments.jsx';
import Members from './pages/Members.jsx';
import Trainers from './pages/Trainers.jsx';
import Tenders from './pages/Tenders.jsx';
import Sidebar from './components/Sidebar.jsx';
import { FullScreenLoader } from './components/LoadingSpinner.jsx';
import { Menu } from 'lucide-react';
import styled from 'styled-components';

const MainContent = styled.main`
  flex: 1;
  transition: all 0.3s;
  min-width: 0;
`;

const MobileNav = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    padding: 14px 20px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--glass-border);
    position: sticky;
    top: 0;
    z-index: 900;
    gap: 14px;
  }
`;

const MobileNavTitle = styled.span`
  font-weight: 800;
  font-size: 1.2rem;
  background: var(--grad-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HamburgerBtn = styled.button`
  background: none;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`;


const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  if (loading) return <FullScreenLoader message="Verifying session…" />;


  if (!currentUser) return <Navigate to="/login" replace />;


  if (!userData) return <FullScreenLoader message="Loading your profile…" />;


  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(o => !o)} />
      <MainContent>
        <MobileNav>
          <HamburgerBtn onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </HamburgerBtn>
          <MobileNavTitle>PAK GYM</MobileNavTitle>
        </MobileNav>
        {children}
      </MainContent>
    </div>
  );
};


const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return children;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '0.9rem'
            }
          }}
        />
        <Routes>

          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />


          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
          <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />


          <Route path="/payments" element={<ProtectedRoute allowedRoles={['Admin', 'Member']}><Payments /></ProtectedRoute>} />


          <Route path="/members" element={<ProtectedRoute allowedRoles={['Admin', 'Trainer']}><Members /></ProtectedRoute>} />


          <Route path="/trainers" element={<ProtectedRoute allowedRoles={['Admin']}><Trainers /></ProtectedRoute>} />
          <Route path="/tenders" element={<ProtectedRoute allowedRoles={['Admin']}><Tenders /></ProtectedRoute>} />


          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
