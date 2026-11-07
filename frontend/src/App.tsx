import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PortfolioEditorPage } from './pages/PortfolioEditorPage';
import { PublicPortfolioView } from './pages/PublicPortfolioView';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

const LayoutWithNav: React.FC<{ children: React.ReactNode; showFooter?: boolean }> = ({ children, showFooter = true }) => (
  <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
    <Navbar />
    <div className="flex-1">{children}</div>
    {showFooter && <Footer />}
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar & Footer */}
          <Route path="/" element={<LayoutWithNav><LandingPage /></LayoutWithNav>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Standalone Public Portfolio View */}
          <Route path="/portfolio/:slug" element={<PublicPortfolioView />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<LayoutWithNav showFooter={false}><DashboardPage /></LayoutWithNav>} />
            <Route path="/builder/:id" element={<PortfolioEditorPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<LayoutWithNav showFooter={false}><AdminDashboardPage /></LayoutWithNav>} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
