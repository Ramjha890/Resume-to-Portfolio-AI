import React from 'react';
import { PortfolioData } from '../types';
import { 
  Github, Linkedin, Twitter, Globe, Mail, Phone, MapPin, 
  ExternalLink, Terminal, Code2, Briefcase, GraduationCap, 
  Award, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

export const ModernDeveloper: React.FC<TemplateProps> = ({ data }) => {
  const { hero, about, skills, work_experience, education, projects, certifications, achievements, contact, social_links, section_visibility } = data;
  const primaryColor = data.styling?.primary_color || '#8b5cf6';

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* Glow decorative orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Developer Header */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <span className="font-mono font-bold tracking-tight text-white">{hero.name.toLowerCase().replace(/\s+/g, '')}.dev</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
            {section_visibility?.about !== false && <a href="#about" className="hover:text-purple-400 transition">About</a>}
            {section_visibility?.projects !== false && <a href="#projects" className="hover:text-purple-400 transition">Projects</a>}
            {section_visibility?.skills !== false && <a href="#skills" className="hover:text-purple-400 transition">Skills</a>}
            {section_visibility?.work_experience !== false && <a href="#experience" className="hover:text-purple-400 transition">Experience</a>}
            {section_visibility?.contact !== false && (
              <a 
                href="#contact" 
                style={{ backgroundColor: primaryColor }}
                className="px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition shadow-lg shadow-purple-900/30"
              >
                Get In Touch
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col items-start space-y-6">
          {hero.open_to_work && (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AVAILABLE FOR HIRE / CONTRACT</span>
            </div>
          )}

          <div className="space-y-3">
            <p className="font-mono text-purple-400 text-sm">Hello World, my name is</p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
              {hero.name || 'Alex Mercer'}
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-400">
              {hero.headline || 'Full Stack Engineer & Cloud Architect'}
            </h2>
          </div>

          <p className="max-w-2xl text-slate-300 text-base sm:text-lg leading-relaxed">
            {hero.summary || 'I build scalable, modern web applications with thoughtful user experiences and rock-solid backend infrastructure.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              style={{ backgroundColor: primaryColor }}
              className="px-6 py-3 rounded-xl text-white font-semibold flex items-center space-x-2 hover:opacity-95 transition shadow-lg shadow-purple-900/20"
            >
              <span>{hero.cta_primary_text || 'View Projects'}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800 transition"
            >
              {hero.cta_secondary_text || 'Contact Me'}
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 pt-4 text-slate-400">
            {social_links.github && (
              <a href={social_links.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-800/60 hover:text-white hover:bg-slate-800 transition">
                <Github className="w-5 h-5" />
              </a>
            )}
            {social_links.linkedin && (
              <a href={social_links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-800/60 hover:text-white hover:bg-slate-800 transition">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {social_links.twitter && (
              <a href={social_links.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-800/60 hover:text-white hover:bg-slate-800 transition">
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {hero.email && (
              <a href={`mailto:${hero.email}`} className="p-2.5 rounded-lg bg-slate-800/60 hover:text-white hover:bg-slate-800 transition">
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-5xl mx-auto px-6 space-y-24 pb-28">

        {/* About Section */}
        {section_visibility?.about !== false && (
          <section id="about" className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center space-x-3 mb-6">
              <span className="font-mono text-purple-400 text-sm">01.</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">About Me</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-base sm:text-lg mb-6">
              {about.bio || hero.summary}
            </p>
            {about.highlights && about.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                {about.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-slate-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Projects Section */}
        {section_visibility?.projects !== false && projects && projects.length > 0 && (
          <section id="projects" className="space-y-8">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-purple-400 text-sm">02.</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div 
                  key={proj.id}
                  className="group p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Code2 className="w-8 h-8 text-purple-400" />
                      <div className="flex items-center space-x-3 text-slate-400">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition">
                      {proj.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {proj.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
                    {proj.tags?.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-1 rounded bg-slate-800 text-purple-300 text-xs font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {section_visibility?.skills !== false && skills && skills.length > 0 && (
          <section id="skills" className="space-y-8">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-purple-400 text-sm">03.</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Skills & Technologies</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((cat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <h3 className="font-mono text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
                    {cat.category_name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills?.map((sk, sIdx) => (
                      <span key={sIdx} className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 text-sm font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience Section */}
        {section_visibility?.work_experience !== false && work_experience && work_experience.length > 0 && (
          <section id="experience" className="space-y-8">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-purple-400 text-sm">04.</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Work Experience</h2>
            </div>
            <div className="space-y-6">
              {work_experience.map((exp) => (
                <div key={exp.id} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      <p className="text-purple-400 font-medium text-sm">{exp.company} {exp.location && `• ${exp.location}`}</p>
                    </div>
                    <span className="font-mono text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full self-start sm:self-auto">
                      {exp.start_date} - {exp.end_date || 'Present'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">{exp.description}</p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
                      {exp.highlights.map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {section_visibility?.education !== false && education && education.length > 0 && (
          <section id="education" className="space-y-8">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-purple-400 text-sm">05.</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Education</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {education.map((edu) => (
                <div key={edu.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <GraduationCap className="w-6 h-6 text-purple-400 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">{edu.degree}</h3>
                  <p className="text-slate-300 text-sm mb-2">{edu.institution}</p>
                  <p className="font-mono text-xs text-slate-400">{edu.start_date} - {edu.end_date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {section_visibility?.contact !== false && (
          <section id="contact" className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-purple-950/30 border border-slate-800 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {contact.title || "Let's Connect"}
            </h2>
            <p className="text-slate-300 max-w-lg mx-auto mb-8 text-base">
              {contact.subtitle || "Whether you have a question, project proposal, or just want to say hi, my inbox is open!"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {hero.email && (
                <a
                  href={`mailto:${hero.email}`}
                  style={{ backgroundColor: primaryColor }}
                  className="px-8 py-3.5 rounded-xl text-white font-semibold flex items-center space-x-2 hover:opacity-95 transition shadow-lg shadow-purple-900/30"
                >
                  <Mail className="w-5 h-5" />
                  <span>Send An Email</span>
                </a>
              )}
              {hero.phone && (
                <a
                  href={`tel:${hero.phone}`}
                  className="px-8 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold flex items-center space-x-2 hover:bg-slate-700 transition"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Me</span>
                </a>
              )}
            </div>
          </section>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-8 text-center text-xs font-mono text-slate-500">
        <p>© {new Date().getFullYear()} {hero.name}. Built with AI Resume-to-Portfolio Generator.</p>
      </footer>
    </div>
  );
};
