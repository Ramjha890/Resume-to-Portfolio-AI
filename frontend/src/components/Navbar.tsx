import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, User, LogOut, LayoutDashboard, Shield, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              PortfolioCraft <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Resume-to-Portfolio Generator</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <Link to="/#features" className="hover:text-white transition">Features</Link>
          <Link to="/#how-it-works" className="hover:text-white transition">How It Works</Link>
          <Link to="/#templates" className="hover:text-white transition">Templates</Link>
          <Link to="/#faq" className="hover:text-white transition">FAQ</Link>
        </div>

        {/* User Auth CTA */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {user.is_admin && (
                <Link
                  to="/admin"
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center space-x-1.5 hover:bg-amber-500/20 transition"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold flex items-center space-x-2 hover:bg-slate-800 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-400" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-slate-300 text-sm font-semibold hover:text-white transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-95 transition shadow-lg shadow-brand-600/25 flex items-center space-x-1.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-6 py-6 space-y-4">
          <Link to="/#features" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 font-medium">Features</Link>
          <Link to="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 font-medium">How It Works</Link>
          <Link to="/#templates" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 font-medium">Templates</Link>
          <Link to="/#faq" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 font-medium">FAQ</Link>
          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2.5 text-center rounded-xl bg-brand-600 text-white font-semibold">
                  Go to Dashboard
                </Link>
                {user.is_admin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2 text-center rounded-xl bg-amber-500/10 text-amber-400 font-semibold text-sm">
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full py-2 text-center text-rose-400 text-sm">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2.5 text-center rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full py-2.5 text-center rounded-xl bg-brand-600 text-white font-semibold">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
