import React from 'react';
import { PortfolioData } from '../types';
import { Sparkles, Layers, ArrowUpRight, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

export const GlassmorphismPortfolio: React.FC<TemplateProps> = ({ data }) => {
  const { hero, about, skills, work_experience, education, projects, contact, social_links, section_visibility } = data;

  return (
    <div className="min-h-screen bg-[#070512] text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Radiant ambient backdrop orbs */}
      <div className="fixed -top-40 -left-40 w-[550px] h-[550px] bg-purple-600/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/4 w-[500px] h-[500px] bg-indigo-600/25 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Glass Nav */}
      <div className="sticky top-6 z-50 max-w-4xl mx-auto px-6 mb-8">
        <nav className="rounded-2xl backdrop-blur-2xl bg-white/[0.06] border border-white/15 shadow-2xl shadow-purple-950/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-fuchsia-500 flex items-center justify-center font-bold text-white shadow-lg">
              {hero.name.charAt(0)}
            </span>
            <span className="font-bold text-white text-base tracking-tight">{hero.name}</span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-medium text-slate-300">
            {section_visibility?.about !== false && <a href="#about" className="hover:text-purple-300 transition">About</a>}
            {section_visibility?.projects !== false && <a href="#projects" className="hover:text-purple-300 transition">Works</a>}
            {section_visibility?.skills !== false && <a href="#skills" className="hover:text-purple-300 transition">Skills</a>}
            {section_visibility?.contact !== false && (
              <a href="#contact" className="px-4 py-2 rounded-xl bg-white/[0.12] border border-white/20 text-white font-semibold hover:bg-white/[0.2] transition">
                Connect
              </a>
            )}
          </div>
        </nav>
      </div>

      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.05] border border-white/15 text-purple-300 text-xs font-semibold mb-8">
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>PORTFOLIO & DIGITAL EXPERIENCE</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
          {hero.name}
        </h1>

        <p className="text-2xl sm:text-3xl font-light text-purple-200 mb-6">
          {hero.headline}
        </p>

        <p className="max-w-xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed mb-10">
          {hero.summary}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="px-8 py-4 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold hover:scale-105 transition-all shadow-xl shadow-purple-900/40"
          >
            Explore Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/[0.06] border border-white/15 text-white font-semibold hover:bg-white/[0.12] transition"
          >
            Get In Touch
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 space-y-20 pb-28">

        {/* About Glass Card */}
        {section_visibility?.about !== false && (
          <section id="about" className="rounded-3xl backdrop-blur-2xl bg-white/[0.04] border border-white/15 p-8 sm:p-12 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
            <p className="text-slate-300 text-lg leading-relaxed">{about.bio || hero.summary}</p>
          </section>
        )}

        {/* Projects Glass Grid */}
        {section_visibility?.projects !== false && projects && projects.length > 0 && (
          <section id="projects" className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Highlighted Creations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-3xl backdrop-blur-2xl bg-white/[0.04] border border-white/15 p-8 hover:bg-white/[0.07] hover:border-purple-400/40 transition duration-300 flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition">
                      {proj.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {proj.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {proj.tags?.map((t, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-purple-200">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm font-semibold">
                      {proj.live_url && (
                        <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                      {proj.github_url && (
                        <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                          <span>GitHub</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Glass Grid */}
        {section_visibility?.skills !== false && skills && skills.length > 0 && (
          <section id="skills" className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Capabilities & Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {skills.map((cat, idx) => (
                <div key={idx} className="rounded-2xl backdrop-blur-xl bg-white/[0.04] border border-white/15 p-6">
                  <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-4">
                    {cat.category_name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills?.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-slate-200">
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
            <h2 className="text-3xl font-bold text-white">Experience</h2>
            <div className="space-y-6">
              {work_experience.map((exp) => (
                <div key={exp.id} className="rounded-3xl backdrop-blur-xl bg-white/[0.04] border border-white/15 p-8">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <span className="text-xs text-purple-300 font-mono">{exp.start_date} - {exp.end_date || 'Present'}</span>
                  </div>
                  <p className="text-purple-400 font-medium text-sm mb-3">{exp.company}</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {section_visibility?.contact !== false && (
          <section id="contact" className="rounded-3xl backdrop-blur-2xl bg-white/[0.05] border border-white/20 p-10 sm:p-14 text-center shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Let's Connect</h2>
            <p className="text-slate-300 max-w-md mx-auto mb-8">
              Open to high-impact projects, collaborations, and engineering roles.
            </p>
            <a
              href={`mailto:${hero.email}`}
              className="inline-block px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold hover:scale-105 transition-all shadow-xl shadow-purple-900/40"
            >
              Email {hero.name}
            </a>
          </section>
        )}

      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {hero.name} • Glassmorphism Edition</p>
      </footer>
    </div>
  );
};
