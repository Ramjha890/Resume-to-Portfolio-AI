import React from 'react';
import { PortfolioData } from '../types';
import { Award, Briefcase, TrendingUp, CheckCircle, Mail, Phone, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

export const CorporateProfessional: React.FC<TemplateProps> = ({ data }) => {
  const { hero, about, skills, work_experience, education, projects, contact, social_links, section_visibility } = data;

  return (
    <div className="min-h-screen bg-[#0a1120] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Executive Nav */}
      <nav className="border-b border-slate-800/80 bg-[#0a1120]/90 backdrop-blur-md px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center">
              {hero.name.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight block leading-tight">{hero.name}</span>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">{hero.headline.split('|')[0]}</span>
            </div>
          </div>
          <div className="flex items-center space-x-8 text-sm font-medium text-slate-300">
            {section_visibility?.about !== false && <a href="#executive-summary" className="hover:text-amber-400 transition">Profile</a>}
            {section_visibility?.work_experience !== false && <a href="#leadership" className="hover:text-amber-400 transition">Experience</a>}
            {section_visibility?.projects !== false && <a href="#initiatives" className="hover:text-amber-400 transition">Initiatives</a>}
            {section_visibility?.contact !== false && (
              <a href="#contact" className="px-5 py-2 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition">
                Contact Office
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-2 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded inline-block">
              Executive Portfolio & Leadership
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {hero.name}
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 font-medium leading-relaxed">
              {hero.headline}
            </p>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
              {hero.summary}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#leadership"
                className="px-8 py-3.5 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
              >
                View Track Record
              </a>
              <a
                href={`mailto:${hero.email}`}
                className="px-8 py-3.5 rounded border border-slate-700 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
              >
                Inquire Directly
              </a>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Leadership Focus</span>
              <p className="text-lg font-bold text-white mt-1">Strategic Growth & Technology Scaling</p>
            </div>
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Direct Office</span>
              <p className="text-sm text-slate-300 mt-1">{hero.email}</p>
              {hero.phone && <p className="text-sm text-slate-400 mt-0.5">{hero.phone}</p>}
            </div>
            <div>
              <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Location</span>
              <p className="text-sm text-slate-300 mt-1">{hero.location || 'Global Headquarters'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 space-y-24 pb-28">

        {/* Executive Summary */}
        {section_visibility?.about !== false && (
          <section id="executive-summary" className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h2 className="text-xs uppercase font-bold tracking-widest text-amber-400 mb-3">Executive Summary</h2>
            <h3 className="text-2xl font-bold text-white mb-6">Proven leadership in execution and technical stewardship.</h3>
            <p className="text-slate-300 text-lg leading-relaxed">{about.bio || hero.summary}</p>
          </section>
        )}

        {/* Experience / Leadership */}
        {section_visibility?.work_experience !== false && work_experience && work_experience.length > 0 && (
          <section id="leadership" className="space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Career Trajectory & Leadership Milestones</h2>
            </div>
            <div className="space-y-6">
              {work_experience.map((exp) => (
                <div key={exp.id} className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                      <p className="text-amber-400 font-semibold text-base mt-1">{exp.company}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-800 px-3.5 py-1.5 rounded self-start sm:self-auto mt-2 sm:mt-0">
                      {exp.start_date} - {exp.end_date || 'Present'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed mb-4">{exp.description}</p>
                  {exp.highlights && (
                    <ul className="space-y-2 text-sm text-slate-300">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Initiatives / Projects */}
        {section_visibility?.projects !== false && projects && projects.length > 0 && (
          <section id="initiatives" className="space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Strategic Deliverables & Initiatives</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj) => (
                <div key={proj.id} className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{proj.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{proj.description}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proj.tags?.map((t, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded bg-slate-800 text-amber-300 border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                    {proj.live_url && (
                      <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="text-amber-400 font-semibold text-xs uppercase tracking-wider hover:underline flex items-center gap-1">
                        <span>Review Initiative</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {section_visibility?.contact !== false && (
          <section id="contact" className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Executive Inquiry</h2>
            <p className="text-slate-400 text-base max-w-lg mx-auto mb-8">
              For executive consultations, advisory appointments, or board representation inquiries.
            </p>
            <a
              href={`mailto:${hero.email}`}
              className="inline-block px-10 py-4 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
            >
              Direct Message: {hero.email}
            </a>
          </section>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {hero.name}. Confidential Executive Profile.</p>
      </footer>
    </div>
  );
};
