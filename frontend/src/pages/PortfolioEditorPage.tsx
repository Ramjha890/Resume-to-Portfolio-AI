import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { portfolioApi, aiApi } from '../services/api';
import { Portfolio, PortfolioData } from '../types';
import { TemplateRenderer, TEMPLATE_METADATA } from '../templates/TemplateRenderer';
import { ShareModal } from '../components/ShareModal';
import { 
  Save, Globe, ArrowLeft, Monitor, Tablet, Smartphone, Maximize2, 
  Sparkles, Layers, Sliders, Check, Download, ExternalLink, Plus, Trash2, Eye, EyeOff
} from 'lucide-react';

export const PortfolioEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'sections'>('content');
  const [activeContentSection, setActiveContentSection] = useState<string>('hero');
  const [aiPolishing, setAiPolishing] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      if (!id) return;
      try {
        const data = await portfolioApi.getById(parseInt(id, 10));
        setPortfolio(data);
      } catch (err: any) {
        alert(err.message || 'Failed to load portfolio');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [id, navigate]);

  const handleSave = async (autoSave = false) => {
    if (!portfolio) return;
    setSaving(true);
    try {
      const updated = await portfolioApi.update(portfolio.id, {
        portfolio_name: portfolio.portfolio_name,
        slug: portfolio.slug,
        template_id: portfolio.template_id,
        portfolio_data: portfolio.portfolio_data,
        is_published: portfolio.is_published
      });
      setPortfolio(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      if (!autoSave) alert(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!portfolio) return;
    try {
      if (portfolio.is_published) {
        await portfolioApi.unpublish(portfolio.id);
        setPortfolio({ ...portfolio, is_published: false });
      } else {
        await portfolioApi.publish(portfolio.id);
        setPortfolio({ ...portfolio, is_published: true });
        // Launch confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setShareModalOpen(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle publish status');
    }
  };

  const updatePortfolioData = (updater: (prev: PortfolioData) => PortfolioData) => {
    if (!portfolio) return;
    const newData = updater(portfolio.portfolio_data);
    setPortfolio({
      ...portfolio,
      portfolio_data: newData
    });
  };

  const handleAiPolish = async (fieldKey: string, originalText: string, tone = 'professional') => {
    setAiPolishing(fieldKey);
    try {
      const polished = await aiApi.improveText(fieldKey, originalText, tone);
      if (fieldKey === 'headline') {
        updatePortfolioData(d => ({ ...d, hero: { ...d.hero, headline: polished } }));
      } else if (fieldKey === 'summary') {
        updatePortfolioData(d => ({ ...d, hero: { ...d.hero, summary: polished } }));
      } else if (fieldKey === 'about_bio') {
        updatePortfolioData(d => ({ ...d, about: { ...d.about, bio: polished } }));
      }
    } catch (err) {
      alert('AI polishing failed. Check your API key or network.');
    } finally {
      setAiPolishing(null);
    }
  };

  if (loading || !portfolio) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading portfolio workspace...</p>
        </div>
      </div>
    );
  }

  const pData = portfolio.portfolio_data;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Workspace Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <input
              type="text"
              value={portfolio.portfolio_name}
              onChange={(e) => setPortfolio({ ...portfolio, portfolio_name: e.target.value })}
              className="bg-transparent font-bold text-white text-base hover:bg-slate-800/60 px-2 py-0.5 rounded outline-none focus:ring-1 focus:ring-brand-500 transition"
            />
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 px-2">
              <span>Slug: /portfolio/{portfolio.slug}</span>
            </div>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="hidden md:flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 space-x-1">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceView === 'desktop' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceView === 'tablet' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-4 h-4" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              deviceView === 'mobile' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <a
            href={portfolioApi.getExportZipUrl(portfolio.id)}
            download
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            title="Export Standalone ZIP Bundle"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ZIP</span>
          </a>

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition disabled:opacity-50"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={handlePublishToggle}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
              portfolio.is_published
                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30 hover:opacity-95'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{portfolio.is_published ? 'Unpublish' : 'Publish Live'}</span>
          </button>

          {portfolio.is_published && (
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300 hover:bg-brand-500/20 text-xs font-semibold flex items-center space-x-1"
              title="Share Link"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Editor & Preview Split Workspace */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT SIDEBAR: Controls & Form Editor (Width 400px) */}
        <aside className="w-full md:w-[420px] bg-slate-900/95 border-r border-slate-800 flex flex-col z-30 shrink-0">
          {/* Editor Mode Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950 p-2 gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2 rounded-lg transition ${
                activeTab === 'content' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Content Edit
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 rounded-lg transition ${
                activeTab === 'theme' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Templates ({TEMPLATE_METADATA.length})
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-2 rounded-lg transition ${
                activeTab === 'sections' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Reorder
            </button>
          </div>

          {/* Tab 1: Content Editor */}
          {activeTab === 'content' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Content Section Selector Pills */}
              <div className="flex overflow-x-auto p-3 gap-2 border-b border-slate-800/80 bg-slate-950/60 no-scrollbar text-xs">
                {['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact', 'social'].map((sKey) => (
                  <button
                    key={sKey}
                    onClick={() => setActiveContentSection(sKey)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium capitalize transition ${
                      activeContentSection === sKey ? 'bg-brand-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {sKey}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* HERO SECTION FORM */}
                {activeContentSection === 'hero' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hero / Introduction</h4>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={pData.hero.name}
                        onChange={(e) => updatePortfolioData(d => ({ ...d, hero: { ...d.hero, name: e.target.value } }))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm text-white focus:border-brand-500 outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-slate-400">Professional Headline</label>
                        <button
                          onClick={() => handleAiPolish('headline', pData.hero.headline)}
                          className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{aiPolishing === 'headline' ? 'Polishing...' : 'Polish with AI'}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={pData.hero.headline}
                        onChange={(e) => updatePortfolioData(d => ({ ...d, hero: { ...d.hero, headline: e.target.value } }))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm text-white focus:border-brand-500 outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-slate-400">Bio Summary</label>
                        <button
                          onClick={() => handleAiPolish('summary', pData.hero.summary)}
                          className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{aiPolishing === 'summary' ? 'Polishing...' : 'Polish with AI'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={pData.hero.summary}
                        onChange={(e) => updatePortfolioData(d => ({ ...d, hero: { ...d.hero, summary: e.target.value } }))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm text-white focus:border-brand-500 outline-none leading-relaxed"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Email</label>
                        <input
                          type="email"
                          value={pData.hero.email}
                          onChange={(e) => updatePortfolioData(d => ({ ...d, hero: { ...d.hero, email: e.target.value } }))}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Location</label>
                        <input
                          type="text"
                          value={pData.hero.location || ''}
                          onChange={(e) => updatePortfolioData(d => ({ ...d, hero: { ...d.hero, location: e.target.value } }))}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="openToWork"
                        checked={pData.hero.open_to_work}
                        onChange={(e) => updatePortfolioData(d => ({ ...d, hero: { ...d.hero, open_to_work: e.target.checked } }))}
                        className="rounded border-slate-800 bg-slate-950 text-brand-500 focus:ring-brand-500"
                      />
                      <label htmlFor="openToWork" className="text-xs text-slate-300 cursor-pointer">
                        Display "Open to Work / Available" Badge
                      </label>
                    </div>
                  </div>
                )}

                {/* ABOUT SECTION FORM */}
                {activeContentSection === 'about' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">About Me Section</h4>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-slate-400">Detailed Bio</label>
                        <button
                          onClick={() => handleAiPolish('about_bio', pData.about.bio || pData.hero.summary)}
                          className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{aiPolishing === 'about_bio' ? 'Polishing...' : 'Polish with AI'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={5}
                        value={pData.about.bio}
                        onChange={(e) => updatePortfolioData(d => ({ ...d, about: { ...d.about, bio: e.target.value } }))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm text-white focus:border-brand-500 outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* SKILLS SECTION FORM */}
                {activeContentSection === 'skills' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Skills Categories</h4>
                      <button
                        onClick={() => {
                          const newCatName = prompt('Enter new category name:');
                          if (newCatName) {
                            updatePortfolioData(d => ({
                              ...d,
                              skills: [...d.skills, { category_name: newCatName, skills: ['Skill 1'] }]
                            }));
                          }
                        }}
                        className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Category</span>
                      </button>
                    </div>

                    {pData.skills.map((cat, catIdx) => (
                      <div key={catIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={cat.category_name}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolioData(d => {
                                const newSkills = [...d.skills];
                                newSkills[catIdx].category_name = val;
                                return { ...d, skills: newSkills };
                              });
                            }}
                            className="bg-transparent font-bold text-xs uppercase text-brand-300 outline-none"
                          />
                          <button
                            onClick={() => {
                              updatePortfolioData(d => ({
                                ...d,
                                skills: d.skills.filter((_, i) => i !== catIdx)
                              }));
                            }}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {cat.skills.map((sk, skIdx) => (
                            <span key={skIdx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-850 border border-slate-700 text-xs text-slate-200">
                              <span>{sk}</span>
                              <button
                                onClick={() => {
                                  updatePortfolioData(d => {
                                    const newSkills = [...d.skills];
                                    newSkills[catIdx].skills = newSkills[catIdx].skills.filter((_, i) => i !== skIdx);
                                    return { ...d, skills: newSkills };
                                  });
                                }}
                                className="text-slate-400 hover:text-white"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>

                        <input
                          type="text"
                          placeholder="Type skill & press Enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              const val = e.currentTarget.value.trim();
                              updatePortfolioData(d => {
                                const newSkills = [...d.skills];
                                newSkills[catIdx].skills.push(val);
                                return { ...d, skills: newSkills };
                              });
                              e.currentTarget.value = '';
                            }
                          }}
                          className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-white outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* PROJECTS SECTION FORM */}
                {activeContentSection === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Projects</h4>
                      <button
                        onClick={() => {
                          const newProj = {
                            id: `proj-${Date.now()}`,
                            title: 'New Featured Project',
                            description: 'Description of the problem solved and engineering architecture.',
                            tags: ['React', 'TypeScript'],
                            live_url: '',
                            github_url: '',
                            featured: true
                          };
                          updatePortfolioData(d => ({ ...d, projects: [newProj, ...d.projects] }));
                        }}
                        className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    {pData.projects.map((proj, pIdx) => (
                      <div key={proj.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolioData(d => {
                                const projs = [...d.projects];
                                projs[pIdx].title = val;
                                return { ...d, projects: projs };
                              });
                            }}
                            className="bg-transparent font-bold text-sm text-white outline-none w-full mr-2"
                          />
                          <button
                            onClick={() => {
                              updatePortfolioData(d => ({
                                ...d,
                                projects: d.projects.filter((_, i) => i !== pIdx)
                              }));
                            }}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolioData(d => {
                              const projs = [...d.projects];
                              projs[pIdx].description = val;
                              return { ...d, projects: projs };
                            });
                          }}
                          className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Live URL"
                            value={proj.live_url || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolioData(d => {
                                const projs = [...d.projects];
                                projs[pIdx].live_url = val;
                                return { ...d, projects: projs };
                              });
                            }}
                            className="text-xs bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-300 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="GitHub URL"
                            value={proj.github_url || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolioData(d => {
                                const projs = [...d.projects];
                                projs[pIdx].github_url = val;
                                return { ...d, projects: projs };
                              });
                            }}
                            className="text-xs bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-300 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* EXPERIENCE SECTION FORM */}
                {activeContentSection === 'experience' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Experience</h4>
                      <button
                        onClick={() => {
                          const newExp = {
                            id: `exp-${Date.now()}`,
                            company: 'Company Name',
                            role: 'Software Engineer',
                            location: 'Remote',
                            start_date: '2023',
                            end_date: 'Present',
                            current: true,
                            description: 'Led technical implementation of key customer-facing features.',
                            highlights: ['Engineered scalable microservices']
                          };
                          updatePortfolioData(d => ({ ...d, work_experience: [newExp, ...d.work_experience] }));
                        }}
                        className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Experience</span>
                      </button>
                    </div>

                    {pData.work_experience.map((exp, expIdx) => (
                      <div key={exp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolioData(d => {
                                const exps = [...d.work_experience];
                                exps[expIdx].role = val;
                                return { ...d, work_experience: exps };
                              });
                            }}
                            className="bg-transparent font-bold text-sm text-white outline-none w-full"
                          />
                          <button
                            onClick={() => {
                              updatePortfolioData(d => ({
                                ...d,
                                work_experience: d.work_experience.filter((_, i) => i !== expIdx)
                              }));
                            }}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolioData(d => {
                              const exps = [...d.work_experience];
                              exps[expIdx].company = val;
                              return { ...d, work_experience: exps };
                            });
                          }}
                          className="w-full text-xs font-semibold text-brand-300 bg-transparent outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Start Date"
                            value={exp.start_date}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolioData(d => {
                                const exps = [...d.work_experience];
                                exps[expIdx].start_date = val;
                                return { ...d, work_experience: exps };
                              });
                            }}
                            className="text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                          />
                          <input
                            type="text"
                            placeholder="End Date"
                            value={exp.end_date}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolioData(d => {
                                const exps = [...d.work_experience];
                                exps[expIdx].end_date = val;
                                return { ...d, work_experience: exps };
                              });
                            }}
                            className="text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SOCIAL LINKS FORM */}
                {activeContentSection === 'social' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Social Links</h4>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">GitHub Profile URL</label>
                      <input
                        type="text"
                        value={pData.social_links.github || ''}
                        onChange={(e) => updatePortfolioData(d => ({ ...d, social_links: { ...d.social_links, github: e.target.value } }))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={pData.social_links.linkedin || ''}
                        onChange={(e) => updatePortfolioData(d => ({ ...d, social_links: { ...d.social_links, linkedin: e.target.value } }))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Twitter / X URL</label>
                      <input
                        type="text"
                        value={pData.social_links.twitter || ''}
                        onChange={(e) => updatePortfolioData(d => ({ ...d, social_links: { ...d.social_links, twitter: e.target.value } }))}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Template Switcher */}
          {activeTab === 'theme' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Switch Design Template</h4>
              <p className="text-xs text-slate-400 mb-4">Click any template to apply immediately without losing any content.</p>
              <div className="space-y-3">
                {TEMPLATE_METADATA.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => setPortfolio({ ...portfolio, template_id: tmpl.id })}
                    className={`cursor-pointer p-4 rounded-xl border transition ${
                      portfolio.template_id === tmpl.id
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-bold text-white">{tmpl.name}</h5>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tmpl.color }} />
                    </div>
                    <span className="text-[10px] text-brand-300 font-mono block mb-1">{tmpl.category}</span>
                    <p className="text-xs text-slate-400">{tmpl.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Reorder / Visibility */}
          {activeTab === 'sections' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Section Visibility</h4>
              <p className="text-xs text-slate-400 mb-4">Toggle visibility of portfolio sections.</p>
              <div className="space-y-2">
                {Object.entries(pData.section_visibility || {}).map(([sKey, isVisible]) => (
                  <div key={sKey} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-sm font-medium capitalize text-slate-200">{sKey.replace('_', ' ')}</span>
                    <button
                      onClick={() => {
                        updatePortfolioData(d => ({
                          ...d,
                          section_visibility: {
                            ...d.section_visibility,
                            [sKey]: !isVisible
                          }
                        }));
                      }}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                        isVisible ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-900'
                      }`}
                    >
                      {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT AREA: Interactive Multi-Device Preview Viewport */}
        <main className="flex-1 bg-slate-950 overflow-y-auto flex items-center justify-center p-4 md:p-8">
          <div
            className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 ${
              deviceView === 'desktop'
                ? 'w-full h-full'
                : deviceView === 'tablet'
                ? 'w-[768px] h-[95%] border-slate-700 shadow-2xl'
                : 'w-[375px] h-[95%] border-slate-700 shadow-2xl'
            }`}
          >
            <div className="h-full overflow-y-auto">
              <TemplateRenderer
                templateId={portfolio.template_id}
                data={portfolio.portfolio_data}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        slug={portfolio.slug}
        portfolioName={portfolio.portfolio_name}
      />
    </div>
  );
};
