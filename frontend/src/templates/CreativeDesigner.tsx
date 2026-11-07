import React from 'react';
import { PortfolioData } from '../types';
import { Sparkles, Palette, ArrowUpRight, Github, Linkedin, Mail, Heart } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

export const CreativeDesigner: React.FC<TemplateProps> = ({ data }) => {
  const { hero, about, skills, work_experience, projects, contact, social_links, section_visibility } = data;

  return (
    <div className="min-h-screen bg-[#0e0a1a] text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Radiant Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#0e0a1a]/70 border-b border-rose-500/10 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-500/30">
              {hero.name.charAt(0)}
            </span>
            <span className="font-bold tracking-tight text-white">{hero.name}</span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-medium">
            {section_visibility?.about !== false && <a href="#about" className="hover:text-rose-400 transition">Story</a>}
            {section_visibility?.projects !== false && <a href="#projects" className="hover:text-rose-400 transition">Creations</a>}
            {section_visibility?.skills !== false && <a href="#skills" className="hover:text-rose-400 transition">Skills</a>}
            {section_visibility?.contact !== false && (
              <a href="#contact" className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-rose-500/25">
                Let's Talk
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-8">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>CRAFTING DELIGHTFUL DIGITAL EXPERIENCES</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.05]">
          Designing with <br />
          <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-violet-400 bg-clip-text text-transparent">
            Purpose & Soul.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-light leading-relaxed mb-10">
          Hi, I'm <strong className="font-semibold text-white">{hero.name}</strong> — {hero.headline}. {hero.summary}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold hover:scale-105 transition-all shadow-xl shadow-rose-500/30"
          >
            Explore My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-semibold hover:bg-white/10 transition"
          >
            Say Hello
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 space-y-28 pb-28">

        {/* Selected Projects */}
        {section_visibility?.projects !== false && projects && projects.length > 0 && (
          <section id="projects" className="space-y-12">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-rose-400">Featured Showcase</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-1">Recent Masterpieces</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj, idx) => (
                <div 
                  key={proj.id}
                  className="rounded-3xl p-8 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-rose-500/40 transition duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 mb-6">
                      <Palette className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-rose-300 transition">
                      {proj.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {proj.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {proj.tags?.map((t, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm font-semibold">
                      {proj.live_url && (
                        <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-300 flex items-center gap-1">
                          <span>View Live</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                      {proj.github_url && (
                        <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                          <span>Repository</span>
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

        {/* Story / About */}
        {section_visibility?.about !== false && (
          <section id="about" className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-rose-950/20 via-violet-950/20 to-transparent border border-white/10">
            <h2 className="text-xs uppercase font-bold tracking-widest text-amber-400 mb-4">Behind The Craft</h2>
            <h3 className="text-3xl font-extrabold text-white mb-6">A blend of art, code & human empathy.</h3>
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-6">
              {about.bio || hero.summary}
            </p>
          </section>
        )}

        {/* Skills */}
        {section_visibility?.skills !== false && skills && skills.length > 0 && (
          <section id="skills" className="space-y-8">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-rose-400">Toolkit</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Creative Arsenal</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {skills.map((cat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4">
                    {cat.category_name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills?.map((sk, sIdx) => (
                      <span key={sIdx} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-200">
                        {sk}
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
            <h2 className="text-3xl font-extrabold text-white">Journey So Far</h2>
            <div className="space-y-6">
              {work_experience.map((exp) => (
                <div key={exp.id} className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <span className="text-xs text-rose-400 font-semibold">{exp.start_date} - {exp.end_date || 'Present'}</span>
                  </div>
                  <p className="text-amber-300 text-sm font-medium mb-3">{exp.company}</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {section_visibility?.contact !== false && (
          <section id="contact" className="rounded-3xl p-10 sm:p-16 bg-gradient-to-tr from-rose-600 to-amber-600 text-white text-center shadow-2xl shadow-rose-900/30">
            <h2 className="text-3xl sm:text-5xl font-black mb-4">Have an extraordinary idea?</h2>
            <p className="text-white/90 text-lg max-w-xl mx-auto mb-8">
              Let's create something unforgettable together. Drop me a line anytime!
            </p>
            <a
              href={`mailto:${hero.email}`}
              className="inline-block px-10 py-4 rounded-full bg-white text-stone-900 font-extrabold text-base hover:bg-slate-100 transition shadow-lg"
            >
              Reach Out Via Email
            </a>
          </section>
        )}

      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by {hero.name}
        </p>
      </footer>
    </div>
  );
};
