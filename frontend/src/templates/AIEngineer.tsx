import React from 'react';
import { PortfolioData } from '../types';
import { Brain, Cpu, Database, Network, GitBranch, ExternalLink, Github, Mail, Sparkles } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

export const AIEngineer: React.FC<TemplateProps> = ({ data }) => {
  const { hero, about, skills, work_experience, education, projects, contact, social_links, section_visibility } = data;

  return (
    <div className="min-h-screen bg-[#070b1a] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Neural Background effects */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#070b1a]/80 border-b border-indigo-950/60 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-mono text-sm tracking-wide text-white font-bold">{hero.name} <span className="text-indigo-400 font-normal">| AI Lab</span></span>
          </div>
          <div className="flex items-center space-x-6 text-xs font-mono tracking-wider text-slate-400">
            {section_visibility?.projects !== false && <a href="#models" className="hover:text-indigo-400 transition">Models & Work</a>}
            {section_visibility?.skills !== false && <a href="#stack" className="hover:text-indigo-400 transition">Stack</a>}
            {section_visibility?.work_experience !== false && <a href="#experience" className="hover:text-indigo-400 transition">Trajectory</a>}
            {section_visibility?.contact !== false && (
              <a href="#contact" className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30">
                Collaborate
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-8 pt-24 pb-20">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AUTONOMOUS SYSTEMS & MACHINE INTELLIGENCE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          Architecting Intelligence. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
            {hero.name}
          </span>
        </h1>

        <p className="text-xl text-indigo-300 font-mono mb-6">
          // {hero.headline}
        </p>

        <p className="max-w-2xl text-slate-300 text-base sm:text-lg leading-relaxed mb-10">
          {hero.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#models"
            className="px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-mono text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/30 flex items-center gap-2"
          >
            <span>Inspect Models & Code</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-sm hover:border-indigo-500/50 transition"
          >
            Request Research Discussion
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 space-y-24 pb-28">

        {/* Models & Projects */}
        {section_visibility?.projects !== false && projects && projects.length > 0 && (
          <section id="models" className="space-y-8">
            <div className="flex items-center justify-between border-b border-indigo-950 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                <Network className="w-6 h-6 text-indigo-400" />
                Featured AI Models & Systems
              </h2>
              <span className="font-mono text-xs text-indigo-400">BENCHMARK TESTED</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="p-6 rounded-2xl bg-[#0c1226] border border-indigo-950/80 hover:border-indigo-500/50 transition duration-300 flex flex-col justify-between group">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition">{proj.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{proj.description}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proj.tags?.map((t, i) => (
                        <span key={i} className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950/60 border border-indigo-900/60 text-indigo-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      {proj.live_url && (
                        <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                          Live Endpoint &rarr;
                        </a>
                      )}
                      {proj.github_url && (
                        <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                          Weights & Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Neural Stack / Skills */}
        {section_visibility?.skills !== false && skills && skills.length > 0 && (
          <section id="stack" className="space-y-8">
            <div className="border-b border-indigo-950 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                <Cpu className="w-6 h-6 text-indigo-400" />
                AI Infrastructure & Engineering Stack
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {skills.map((cat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#0c1226] border border-indigo-950/80">
                  <h3 className="font-mono text-xs uppercase text-indigo-400 font-bold mb-4 tracking-wider">
                    {cat.category_name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills?.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-mono bg-slate-900 rounded border border-indigo-950 text-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {section_visibility?.work_experience !== false && work_experience && work_experience.length > 0 && (
          <section id="experience" className="space-y-8">
            <div className="border-b border-indigo-950 pb-4">
              <h2 className="text-2xl font-bold text-white">Engineering Experience & Impact</h2>
            </div>
            <div className="space-y-6">
              {work_experience.map((exp) => (
                <div key={exp.id} className="p-6 sm:p-8 rounded-2xl bg-[#0c1226] border border-indigo-950/80">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <span className="font-mono text-xs text-indigo-400">{exp.start_date} - {exp.end_date || 'Present'}</span>
                  </div>
                  <p className="text-indigo-400 text-sm font-medium mb-3">{exp.company}</p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">{exp.description}</p>
                  {exp.highlights && (
                    <ul className="space-y-1.5 text-sm text-slate-400 list-disc list-inside">
                      {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {section_visibility?.contact !== false && (
          <section id="contact" className="p-10 rounded-3xl bg-gradient-to-b from-[#0c1226] to-indigo-950/40 border border-indigo-900/40 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-3">Initiate Collaborative Dialogue</h2>
            <p className="text-slate-300 text-base max-w-lg mx-auto mb-8">
              Open to frontier AI research, foundational modeling, and enterprise machine intelligence roles.
            </p>
            <a
              href={`mailto:${hero.email}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-mono text-sm font-bold tracking-wider hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/30"
            >
              <Mail className="w-4 h-4" />
              <span>Contact AI Engineer</span>
            </a>
          </section>
        )}

      </main>

      <footer className="border-t border-indigo-950/80 py-8 text-center font-mono text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {hero.name} | AI & Systems Lab</p>
      </footer>
    </div>
  );
};
