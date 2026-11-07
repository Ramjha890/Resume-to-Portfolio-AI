import React from 'react';
import { PortfolioData } from '../types';
import { Mail, Phone, MapPin, ExternalLink, ArrowUpRight } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

export const MinimalProfessional: React.FC<TemplateProps> = ({ data }) => {
  const { hero, about, skills, work_experience, education, projects, contact, social_links, section_visibility } = data;

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#121212] text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="border-b border-stone-200 dark:border-stone-800 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-serif text-xl tracking-tight font-semibold italic">{hero.name}</span>
          <div className="flex items-center space-x-6 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
            {section_visibility?.about !== false && <a href="#about" className="hover:text-stone-900 dark:hover:text-white transition">About</a>}
            {section_visibility?.projects !== false && <a href="#projects" className="hover:text-stone-900 dark:hover:text-white transition">Work</a>}
            {section_visibility?.work_experience !== false && <a href="#experience" className="hover:text-stone-900 dark:hover:text-white transition">Experience</a>}
            {section_visibility?.contact !== false && <a href="#contact" className="hover:text-stone-900 dark:hover:text-white transition">Contact</a>}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-8 pt-24 pb-16">
        <h1 className="font-serif text-5xl sm:text-7xl font-normal tracking-tight mb-8 leading-[1.1]">
          {hero.name}
        </h1>
        <p className="text-xl sm:text-2xl text-stone-600 dark:text-stone-400 font-light max-w-2xl mb-8 leading-relaxed">
          {hero.headline}
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-base max-w-xl leading-relaxed mb-10">
          {hero.summary}
        </p>

        <div className="flex items-center space-x-6 text-sm text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800 pt-6">
          {social_links.github && (
            <a href={social_links.github} target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-white flex items-center gap-1 transition">
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
          {social_links.linkedin && (
            <a href={social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-white flex items-center gap-1 transition">
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
          {hero.email && (
            <a href={`mailto:${hero.email}`} className="hover:text-stone-900 dark:hover:text-white flex items-center gap-1 transition">
              <span>{hero.email}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 space-y-20 pb-28">

        {/* About */}
        {section_visibility?.about !== false && (
          <section id="about" className="pt-12 border-t border-stone-200 dark:border-stone-800">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-6 font-semibold">About</h2>
            <div className="text-stone-700 dark:text-stone-300 text-lg leading-relaxed space-y-4">
              <p>{about.bio || hero.summary}</p>
            </div>
          </section>
        )}

        {/* Projects */}
        {section_visibility?.projects !== false && projects && projects.length > 0 && (
          <section id="projects" className="pt-12 border-t border-stone-200 dark:border-stone-800">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-8 font-semibold">Selected Projects</h2>
            <div className="space-y-12">
              {projects.map((proj) => (
                <div key={proj.id} className="group flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="max-w-xl">
                    <h3 className="text-xl font-medium text-stone-900 dark:text-stone-100 mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-4">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {proj.tags?.map((t, i) => (
                        <span key={i} className="text-xs font-mono text-stone-400 dark:text-stone-500">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider shrink-0 pt-1">
                    {proj.live_url && (
                      <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        <span>Visit</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 dark:hover:text-white flex items-center gap-1">
                        <span>Code</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {section_visibility?.work_experience !== false && work_experience && work_experience.length > 0 && (
          <section id="experience" className="pt-12 border-t border-stone-200 dark:border-stone-800">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-8 font-semibold">Experience</h2>
            <div className="space-y-10">
              {work_experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-6">
                  <div className="text-xs font-mono text-stone-400 dark:text-stone-500">
                    {exp.start_date} — {exp.end_date || 'Present'}
                  </div>
                  <div className="sm:col-span-3">
                    <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100">{exp.role}</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mb-3">{exp.company}</p>
                    <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-3">{exp.description}</p>
                    {exp.highlights && (
                      <ul className="list-disc list-inside text-xs text-stone-400 dark:text-stone-500 space-y-1">
                        {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {section_visibility?.skills !== false && skills && skills.length > 0 && (
          <section id="skills" className="pt-12 border-t border-stone-200 dark:border-stone-800">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-6 font-semibold">Core Capabilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {skills.map((cat, idx) => (
                <div key={idx}>
                  <h3 className="font-serif italic text-base text-stone-700 dark:text-stone-300 mb-3">{cat.category_name}</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                    {cat.skills?.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {section_visibility?.education !== false && education && education.length > 0 && (
          <section id="education" className="pt-12 border-t border-stone-200 dark:border-stone-800">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-6 font-semibold">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-base font-medium text-stone-800 dark:text-stone-200">{edu.degree}</h3>
                    <p className="text-stone-500 text-xs">{edu.institution}</p>
                  </div>
                  <span className="text-xs font-mono text-stone-400">{edu.start_date} - {edu.end_date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {section_visibility?.contact !== false && (
          <section id="contact" className="pt-12 border-t border-stone-200 dark:border-stone-800">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-6 font-semibold">Contact</h2>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100 mb-4">
              Get in touch
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-base max-w-lg mb-8">
              Available for full-time roles, advising, and select contract initiatives.
            </p>
            <a
              href={`mailto:${hero.email}`}
              className="inline-block px-8 py-3.5 bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition"
            >
              Write To Me
            </a>
          </section>
        )}

      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800 py-8 text-center text-xs text-stone-400">
        <p>© {new Date().getFullYear()} {hero.name}. All rights reserved.</p>
      </footer>
    </div>
  );
};
