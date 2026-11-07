import React from 'react';
import { PortfolioData } from '../types';
import { Shield, Cpu, Terminal, ExternalLink, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

export const DarkPremium: React.FC<TemplateProps> = ({ data }) => {
  const { hero, about, skills, work_experience, education, projects, contact, social_links, section_visibility } = data;

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-200 font-sans relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-20 border-b border-emerald-950/60 bg-[#04060a]/90 backdrop-blur-md px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-sm tracking-wider uppercase text-emerald-400 font-bold">{hero.name}</span>
          </div>
          <div className="flex items-center space-x-6 text-xs font-mono uppercase tracking-widest text-slate-400">
            {section_visibility?.projects !== false && <a href="#projects" className="hover:text-emerald-400 transition">Projects</a>}
            {section_visibility?.skills !== false && <a href="#skills" className="hover:text-emerald-400 transition">Arsenal</a>}
            {section_visibility?.work_experience !== false && <a href="#experience" className="hover:text-emerald-400 transition">Experience</a>}
            {section_visibility?.contact !== false && (
              <a href="#contact" className="px-3.5 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 transition">
                Connect
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 max-w-5xl mx-auto px-8 pt-24 pb-20">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CYBERNETIC SYSTEMS & ARCHITECTURE</span>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          {hero.name}
        </h1>
        <p className="text-xl sm:text-2xl text-emerald-400 font-mono mb-6 font-medium">
          // {hero.headline}
        </p>
        <p className="max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed mb-10">
          {hero.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-emerald-500 text-black font-mono font-bold text-sm tracking-wider uppercase hover:bg-emerald-400 transition shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Explore Deployments
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg border border-slate-800 bg-slate-900/80 font-mono text-sm tracking-wider uppercase text-slate-300 hover:border-emerald-500/50 transition"
          >
            Initiate Contact
          </a>
        </div>
      </header>

      {/* Sections */}
      <main className="relative z-10 max-w-5xl mx-auto px-8 space-y-24 pb-28">

        {/* Projects */}
        {section_visibility?.projects !== false && projects && projects.length > 0 && (
          <section id="projects" className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h2 className="font-mono text-xl font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                Featured Deployments
              </h2>
              <span className="font-mono text-xs text-slate-500">{projects.length} PROJECTS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-6 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                      {proj.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {proj.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proj.tags?.map((t, i) => (
                        <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/50 text-emerald-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      {proj.live_url && (
                        <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                          <span>LIVE DEMO</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {proj.github_url && (
                        <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                          <span>SOURCE</span>
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {section_visibility?.skills !== false && skills && skills.length > 0 && (
          <section id="skills" className="space-y-8">
            <div className="border-b border-slate-800/80 pb-4">
              <h2 className="font-mono text-xl font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                Technical Arsenal
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {skills.map((cat, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <h3 className="font-mono text-xs uppercase text-emerald-400 font-bold mb-4 tracking-wider">
                    {cat.category_name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills?.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-mono bg-slate-900 rounded border border-slate-800 text-slate-300">
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
            <div className="border-b border-slate-800/80 pb-4">
              <h2 className="font-mono text-xl font-bold uppercase tracking-widest text-white">
                Battle Record & Experience
              </h2>
            </div>
            <div className="space-y-6">
              {work_experience.map((exp) => (
                <div key={exp.id} className="p-6 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                    <span className="font-mono text-xs text-emerald-400">{exp.start_date} - {exp.end_date || 'Present'}</span>
                  </div>
                  <p className="text-emerald-500/80 font-mono text-xs mb-3">{exp.company}</p>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{exp.description}</p>
                  {exp.highlights && (
                    <ul className="space-y-1 font-mono text-xs text-slate-400 list-disc list-inside">
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
          <section id="contact" className="p-10 rounded-2xl bg-gradient-to-b from-slate-950 to-emerald-950/20 border border-emerald-900/40 text-center">
            <h2 className="font-mono text-2xl font-bold uppercase text-white mb-3">
              Establish Secure Connection
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Ready to architect, secure, and deliver cutting-edge systems.
            </p>
            <a
              href={`mailto:${hero.email}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded bg-emerald-500 text-black font-mono font-bold text-sm tracking-wider uppercase hover:bg-emerald-400 transition"
            >
              <Mail className="w-4 h-4" />
              <span>Send Transmission</span>
            </a>
          </section>
        )}

      </main>

      <footer className="border-t border-slate-900 py-6 text-center font-mono text-xs text-slate-600">
        <p>[ SECURE PROTOCOL ACTIVE ] © {new Date().getFullYear()} {hero.name}</p>
      </footer>
    </div>
  );
};
