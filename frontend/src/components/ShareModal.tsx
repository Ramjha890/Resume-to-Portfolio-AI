import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Globe, Twitter, Linkedin } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  portfolioName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, slug, portfolioName }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullUrl = `${window.location.origin}/portfolio/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my new portfolio website generated with AI! 🚀 ${fullUrl}`)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4">
          <Globe className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">Your Portfolio is Live!</h3>
        <p className="text-sm text-slate-400 mb-6">
          Share your portfolio URL with recruiters, clients, and on social media.
        </p>

        {/* Copy Box */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 mb-6">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="bg-transparent text-sm text-slate-200 px-3 py-1 flex-1 outline-none font-mono selection:bg-brand-500"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Twitter className="w-4 h-4 text-sky-400" />
              <span>Share on X</span>
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Linkedin className="w-4 h-4 text-blue-400" />
              <span>Share on LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
