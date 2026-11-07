import React from 'react';
import { PortfolioData } from '../types';
import { GraduationCap, BookOpen, Code, Trophy, ExternalLink, Github, Mail, Sparkles } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

export const StudentPortfolio: React.FC<TemplateProps> = ({ data }) => {
  const { hero, about, skills, work_experience, education, projects, achievements, contact, social_links, section_visibility } = data;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white text-sm">
              {hero.name.charAt(0)}
            </span>
            <span className="font-bold text-white text-base tracking-tight">{hero.name}</span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-medium text-slate-300">
            {section_visibility?.education !== false && <a href="#education" className="hover:text-sky-400 transition">Academics</a>}
            {section_visibility?.projects !== false && <a href="#projects" className="hover:text-sky-400 transition">Projects</a>}
            {section_visibility?.skills !== false && <a href="#skills" className="hover:text-sky-400 transition">Skills</a>}
            {section_visibility?.contact !== false && (
              <a href="#contact" className="px-4 py-2 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-400 transition shadow-md shadow-sky-500/20">
                Contact Me
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-8 pt-20 pb-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-sky-950/40 via-slate-850 to-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASPIRING DEVELOPER & SCHOLAR</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
            Hi, I'm {hero.name} 👋
          </h1>
          <p className="text-xl sm:text-2xl text-sky-400 font-semibold mb-6">
            {hero.headline}
          </p>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            {hero.summary}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="px-6 py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition shadow-lg shadow-sky-500/20"
            >
              Check My Projects
            </a>
            <a
              href={`mailto:${hero.email}`}
              className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-700 transition"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 space-y-20 pb-24">

        {/* Education Highlight */}
        {section_visibility?.education !== false && education && education.length > 0 && (
          <section id="education" className="space-y-6">
            <div className="flex items-center space-x-2 text-sky-400">
              <GraduationCap className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-white">Education & Academics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map((edu) => (
                <div key={edu.id} className="p-6 rounded-2xl bg-slate-850 border border-slate-800">
                  <span className="text-xs font-bold uppercase text-sky-400 tracking-wider">Academic Degree</span>
                  <h3 className="text-xl font-bold text-white mt-1 mb-1">{edu.degree}</h3>
                  <p className="text-slate-300 text-sm mb-3 font-medium">{edu.institution}</p>
                  <p className="text-xs text-slate-400">{edu.start_date} - {edu.end_date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {section_visibility?.projects !== false && projects && projects.length > 0 && (
          <section id="projects" className="space-y-6">
            <div className="flex items-center space-x-2 text-sky-400">
              <Code className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-white">Projects & Hackathons</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="p-6 rounded-2xl bg-slate-850 border border-slate-800 hover:border-sky-500/50 transition duration-300 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{proj.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{proj.description}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proj.tags?.map((t, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded bg-slate-800 text-sky-300 border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-sky-400">
                      {proj.live_url && <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="hover:underline">Live Preview &rarr;</a>}
                      {proj.github_url && <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">GitHub Repo</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {section_visibility?.skills !== false && skills && skills.length > 0 && (
          <section id="skills" className="space-y-6">
            <div className="flex items-center space-x-2 text-sky-400">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {skills.map((cat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-850 border border-slate-800">
                  <h3 className="text-sm font-bold text-sky-300 uppercase mb-4">{cat.category_name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills?.map((s, i) => (
                      <span key={i} className="px-3 py-1 text-xs rounded-lg bg-slate-800 text-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {section_visibility?.contact !== false && (
          <section id="contact" className="p-10 rounded-3xl bg-slate-850 border border-slate-800 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-2">Looking for Internships & New Grad Roles</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              I'm eager to learn, build, and bring high energy to forward-thinking engineering teams.
            </p>
            <a
              href={`mailto:${hero.email}`}
              className="inline-block px-8 py-3.5 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition shadow-lg shadow-sky-500/20"
            >
              Email {hero.name}
            </a>
          </section>
        )}

      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {hero.name} • Student & Developer</p>
      </footer>
    </div>
  );
};
