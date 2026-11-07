import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { portfolioApi, resumeApi, aiApi } from '../services/api';
import { Portfolio, Resume } from '../types';
import { ResumeUploader } from '../components/ResumeUploader';
import { ShareModal } from '../components/ShareModal';
import { 
  Plus, Upload, Globe, Eye, Edit3, Trash2, Copy, Download, 
  ExternalLink, Sparkles, CheckCircle2, Clock, AlertCircle, RefreshCw 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [shareModalData, setShareModalData] = useState<{ isOpen: boolean; slug: string; name: string }>({
    isOpen: false,
    slug: '',
    name: ''
  });

  const loadData = async () => {
    try {
      const [portfoliosData, resumesData] = await Promise.all([
        portfolioApi.getAll(),
        resumeApi.getAll()
      ]);
      setPortfolios(portfoliosData);
      setResumes(resumesData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateFromResume = async (resumeId: number) => {
    setAnalyzing(true);
    setStatusMessage('Analyzing resume and mapping to optimal design layout...');

    try {
      // 1. Analyze resume with AI
      const analysis = await aiApi.analyzeResume(resumeId);

      // 2. Generate canonical portfolio structure
      setStatusMessage('Crafting your portfolio with bespoke styling...');
      const gen = await aiApi.generatePortfolio({
        resume_id: resumeId,
        structured_resume: analysis.structured_resume,
        preferred_template: analysis.recommended_template
      });

      // 3. Create the portfolio in database
      const created = await portfolioApi.create({
        portfolio_name: gen.portfolio_name,
        template_id: gen.template_id,
        portfolio_data: gen.portfolio_data
      });

      setShowUploadModal(false);
      navigate(`/builder/${created.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to generate portfolio. Please try again.');
    } finally {
      setAnalyzing(false);
      setStatusMessage(null);
    }
  };

  const handlePublishToggle = async (portfolio: Portfolio) => {
    try {
      if (portfolio.is_published) {
        await portfolioApi.unpublish(portfolio.id);
      } else {
        await portfolioApi.publish(portfolio.id);
        setShareModalData({
          isOpen: true,
          slug: portfolio.slug,
          name: portfolio.portfolio_name
        });
      }
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle publish status.');
    }
  };

  const handleDeletePortfolio = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await portfolioApi.delete(id);
        setPortfolios(portfolios.filter(p => p.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete portfolio.');
      }
    }
  };

  const handleDuplicatePortfolio = async (id: number) => {
    try {
      const duplicated = await portfolioApi.duplicate(id);
      setPortfolios([duplicated, ...portfolios]);
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate portfolio.');
    }
  };

  const handleDeleteResume = async (id: number) => {
    if (window.confirm('Delete this resume from your history?')) {
      try {
        await resumeApi.delete(id);
        setResumes(resumes.filter(r => r.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete resume.');
      }
    }
  };

  const totalViews = portfolios.reduce((acc, curr) => acc + (curr.visitor_count || 0), 0);
  const publishedCount = portfolios.filter(p => p.is_published).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white pb-24">
      {/* Top Banner / Greeting */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-brand-400 font-bold mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>CREATOR WORKSPACE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome back, {user?.full_name}! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your resumes, edit portfolios, and inspect live visitor analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm hover:opacity-95 transition shadow-lg shadow-brand-600/25 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Resume & Generate</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 space-y-10">

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs uppercase font-mono text-slate-400 font-semibold">Total Portfolios</span>
            <p className="text-3xl font-extrabold text-white mt-2">{portfolios.length}</p>
            <span className="text-xs text-brand-400 mt-1 block">Active layouts</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs uppercase font-mono text-slate-400 font-semibold">Published Portfolios</span>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">{publishedCount}</p>
            <span className="text-xs text-slate-400 mt-1 block">Live on unique URLs</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs uppercase font-mono text-slate-400 font-semibold">Uploaded Resumes</span>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">{resumes.length}</p>
            <span className="text-xs text-slate-400 mt-1 block">Processed by AI parser</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs uppercase font-mono text-slate-400 font-semibold">Total Portfolio Views</span>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">{totalViews}</p>
            <span className="text-xs text-slate-400 mt-1 block">Aggregated visitor count</span>
          </div>
        </div>

        {/* Portfolios Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your Portfolios</h2>
            {portfolios.length > 0 && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>New Portfolio</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-400">Loading your portfolios...</p>
            </div>
          ) : portfolios.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No portfolios created yet</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Upload your resume to automatically generate your first personalized, responsive portfolio website!
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-500 transition shadow-lg shadow-brand-600/25"
              >
                Upload Resume to Get Started
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition duration-300 p-6 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded-full font-bold ${
                        portfolio.is_published
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {portfolio.is_published ? '● Live & Published' : 'Draft Mode'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {portfolio.visitor_count} views
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{portfolio.portfolio_name}</h3>
                    <p className="text-xs text-brand-300 font-mono mb-4">Template: {portfolio.template_id}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-6">
                      {portfolio.portfolio_data?.hero?.headline || 'Professional Portfolio'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/builder/${portfolio.id}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-brand-400" />
                        <span>Edit & Preview</span>
                      </Link>

                      <button
                        onClick={() => handlePublishToggle(portfolio)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          portfolio.is_published
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        <span>{portfolio.is_published ? 'Unpublish' : 'Publish'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                      {portfolio.is_published && (
                        <a
                          href={`/portfolio/${portfolio.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-300 flex items-center gap-1 transition"
                        >
                          <span>Open Live Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <div className="flex items-center space-x-2 ml-auto">
                        <a
                          href={portfolioApi.getExportZipUrl(portfolio.id)}
                          download
                          title="Download Standalone ZIP Code"
                          className="p-1.5 rounded-lg bg-slate-800 hover:text-white transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDuplicatePortfolio(portfolio.id)}
                          title="Duplicate Portfolio"
                          className="p-1.5 rounded-lg bg-slate-800 hover:text-white transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePortfolio(portfolio.id, portfolio.portfolio_name)}
                          title="Delete Portfolio"
                          className="p-1.5 rounded-lg bg-slate-800 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumes Upload History */}
        <div className="space-y-6 pt-8 border-t border-slate-900">
          <h2 className="text-2xl font-bold text-white">Resume Upload History</h2>
          {resumes.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-sm">
              No resumes uploaded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              {resumes.map((resume) => (
                <div key={resume.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white">{resume.original_filename}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {(resume.file_size / 1024).toFixed(1)} KB • Uploaded on {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                    {resume.extracted_text_preview && (
                      <p className="text-xs text-slate-500 italic mt-2 line-clamp-1">
                        "{resume.extracted_text_preview}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleGenerateFromResume(resume.id)}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Portfolio</span>
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 transition"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Upload Resume</h3>
                <p className="text-xs text-slate-400">PDF and DOCX supported (up to 15MB)</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {analyzing ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto" />
                <p className="text-base font-bold text-white">{statusMessage || 'Processing...'}</p>
                <p className="text-xs text-slate-400">Applying AI algorithms to categorize your experience and skills</p>
              </div>
            ) : (
              <ResumeUploader
                onUploadSuccess={(res) => handleGenerateFromResume(res.id)}
                onAnalyzeTrigger={(id) => handleGenerateFromResume(id)}
              />
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalData.isOpen}
        onClose={() => setShareModalData({ ...shareModalData, isOpen: false })}
        slug={shareModalData.slug}
        portfolioName={shareModalData.name}
      />
    </div>
  );
};
