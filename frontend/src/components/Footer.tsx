import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-white">PortfolioCraft AI</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Upload your resume and get a production-ready, ultra-fast portfolio website in minutes with AI.
          </p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Product</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/#features" className="hover:text-white transition">Features</Link></li>
            <li><Link to="/#templates" className="hover:text-white transition">8 Design Templates</Link></li>
            <li><Link to="/#how-it-works" className="hover:text-white transition">How It Works</Link></li>
            <li><Link to="/#before-after" className="hover:text-white transition">Before & After</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/dashboard" className="hover:text-white transition">User Dashboard</Link></li>
            <li><Link to="/register" className="hover:text-white transition">Create Free Account</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
            <li><a href="/docs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">FastAPI Backend Docs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Connect & Source</h4>
          <p className="text-sm text-slate-400 mb-4">Export static code, download as ZIP, or publish directly with instant SSL URLs.</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} PortfolioCraft AI. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Crafted for builders, developers, and leaders worldwide.
        </p>
      </div>
    </footer>
  );
};
