import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import { Portfolio } from '../types';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';

export const PublicPortfolioView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublic() {
      if (!slug) return;
      try {
        const data = await publicApi.getPublicPortfolio(slug);
        setPortfolio(data);
      } catch (err: any) {
        setError(err.message || 'Portfolio not found or private.');
      } finally {
        setLoading(false);
      }
    }
    fetchPublic();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Portfolio Unavailable</h2>
        <p className="text-slate-400 max-w-md mb-8 text-sm">
          {error || 'This portfolio is either unpublished or does not exist.'}
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-slate-800 text-white font-semibold text-sm hover:bg-slate-700 flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <TemplateRenderer
        templateId={portfolio.template_id}
        data={portfolio.portfolio_data}
      />

      {/* Floating subtle badge to credit the platform & allow viewers to build their own */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium shadow-2xl backdrop-blur-md transition group"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400 group-hover:scale-110 transition" />
          <span>Built with PortfolioCraft AI</span>
        </Link>
      </div>
    </div>
  );
};
