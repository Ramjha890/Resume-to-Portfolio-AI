import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Upload, Zap, Eye, Download, Globe, Shield, 
  CheckCircle2, ChevronDown, Laptop, Smartphone, Tablet, Code2, Star, Layers, Cpu
} from 'lucide-react';
import { TEMPLATE_METADATA } from '../templates/TemplateRenderer';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const categories = ['All', 'Engineering', 'Design & UI/UX', 'AI & Data Science', 'Corporate', 'Academic & Internships', 'Modernist'];

  const filteredTemplates = selectedCategory === 'All'
    ? TEMPLATE_METADATA
    : TEMPLATE_METADATA.filter(t => t.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const faqs = [
    {
      q: "How does the AI Resume-to-Portfolio Generator work?",
      a: "Simply upload your resume in PDF or DOCX format. Our AI engine extracts and categorizes your projects, work experience, technical skills, education, and credentials without hallucinating false information. It then automatically maps your information into a bespoke, responsive personal portfolio."
    },
    {
      q: "Can I customize the sections and content after generation?",
      a: "Yes! Every single word, bullet point, skill chip, and section can be edited in real-time. You can reorder sections, toggle their visibility, change themes, switch between all 8 templates instantly, and personalize colors and fonts."
    },
    {
      q: "Do I get a live public website URL?",
      a: "Yes. Every user gets a unique, customizable public URL like yourdomain.com/portfolio/your-name with built-in visitor analytics and zero hosting configuration required."
    },
    {
      q: "Can I download the source code and host it myself?",
      a: "Yes! You can click 'Download ZIP' anytime to get a completely standalone HTML/CSS bundle ready to deploy to GitHub Pages, Netlify, or Vercel with zero vendor lock-in."
    },
    {
      q: "Is my personal data and resume secure?",
      a: "Absolutely. Your uploaded resume is private and only accessible by your authenticated account. We use industry-standard encryption, secure JWT sessions, and strict access controls."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Background ambient mesh */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-brand-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Next-Generation Resume to Website Platform</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-8 leading-[1.08]">
          Your Resume Deserves a <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            Beautiful Website.
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed mb-12">
          Transform your resume into a stunning professional portfolio with AI. Upload your resume, customize your design, and publish your personal website in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to={user ? "/dashboard" : "/register"}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-base hover:opacity-95 transition shadow-xl shadow-brand-600/30 flex items-center justify-center space-x-2"
          >
            <span>Generate My Portfolio</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#templates"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-base hover:bg-slate-800 hover:text-white transition"
          >
            Explore Templates
          </a>
        </div>

        {/* Hero Interactive Mockup Preview */}
        <div className="relative mx-auto max-w-5xl rounded-3xl p-3 bg-gradient-to-b from-slate-800/80 via-slate-900/60 to-slate-950 border border-slate-800 shadow-2xl shadow-brand-950/40">
          <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 p-6 md:p-8 text-left">
            {/* Mock browser header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-6 py-1 rounded-full bg-slate-950 text-xs font-mono text-slate-400 border border-slate-800 flex items-center space-x-2">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>yourdomain.com/portfolio/ramkrishna-jha</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">Live & Published</span>
              </div>
            </div>

            {/* Mock website content snippet */}
            <div className="pt-8 pb-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-mono font-semibold">
                  FULL STACK DEVELOPER
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Ramkrishna Jha
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Specialized in building high-scale distributed systems, modern React frontends, and AI integrations. Engineered core platforms handling 100K+ monthly active users.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-brand-300 font-mono">React</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-brand-300 font-mono">FastAPI</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-brand-300 font-mono">TypeScript</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-brand-300 font-mono">PostgreSQL</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-brand-300 font-mono">Docker</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-sm">
                <div className="flex justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span>AI Parsing Speed</span>
                  <span className="text-emerald-400 font-bold">1.8s</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span>Sections Structured</span>
                  <span className="text-white font-bold">8 Sections</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Active Template</span>
                  <span className="text-purple-400 font-bold">Modern Developer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-brand-400 uppercase tracking-widest font-bold">Four Seamless Steps</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">How It Works</h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            From raw PDF or Word document to a responsive live website in under 60 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Upload Resume",
              desc: "Drag and drop your PDF or DOCX file. Our secure parser extracts text instantly.",
              icon: Upload,
              color: "text-brand-400"
            },
            {
              step: "02",
              title: "AI Analysis",
              desc: "Groq Llama-3 AI categorizes skills, work history, projects, and education accurately.",
              icon: Zap,
              color: "text-amber-400"
            },
            {
              step: "03",
              title: "Choose & Customize",
              desc: "Select from 8 professional design templates. Reorder and polish sections easily.",
              icon: Layers,
              color: "text-cyan-400"
            },
            {
              step: "04",
              title: "Publish & Share",
              desc: "Receive your unique public URL or download clean static code as a ZIP archive.",
              icon: Globe,
              color: "text-emerald-400"
            }
          ].map((item, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-slate-500 font-bold block mb-4">STEP {item.step}</span>
                <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BEFORE AND AFTER COMPARISON */}
      <section id="before-after" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-brand-400 uppercase tracking-widest font-bold">The Transformation</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">Before & After</h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Say goodbye to dull black-and-white A4 sheets. Upgrade to an immersive digital experience that recruiters remember.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Before: Monotonous text document */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
                  Standard Flat Resume
                </span>
                <span className="text-xs text-slate-500">Traditional PDF / Word</span>
              </div>
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400 space-y-3 leading-relaxed">
                <p className="text-white font-bold text-sm">RAMKRISHNA JHA — SOFTWARE DEVELOPER</p>
                <p>Email: ramkrishna@example.com | Phone: +1 555-0192</p>
                <div className="h-px bg-slate-800 my-2" />
                <p className="text-slate-300 font-semibold">WORK EXPERIENCE:</p>
                <p>• Lead Engineer, TechCorp (2022 - Present)<br />- Built backend microservices and databases.</p>
                <p className="text-slate-300 font-semibold">SKILLS:</p>
                <p>JavaScript, React, Python, Docker, SQL, Git, Linux</p>
                <p className="text-slate-500 italic mt-4">[ Static, non-interactive, hard to stand out among 500 applicants ]</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-6 text-center">Standard documents get scanned for 6 seconds and archived.</p>
          </div>

          {/* After: Dynamic Portfolio */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-brand-950/40 to-slate-900 border border-brand-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  AI-Generated Web Portfolio
                </span>
                <span className="text-xs text-brand-400 font-semibold">Interactive & Shareable</span>
              </div>
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">Ramkrishna Jha</h4>
                    <p className="text-xs text-brand-300">Full Stack Engineer & Cloud Architect</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                    Open To Work
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono">React 18</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono">FastAPI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono">PostgreSQL</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Live Project Demo</span>
                    <span className="text-white font-semibold">Distributed Cache</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">GitHub Repository</span>
                    <span className="text-white font-semibold">github.com/repo</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-300 mt-6 text-center font-medium">Clickable live demo links, mobile responsive, and custom domain ready.</p>
          </div>
        </div>
      </section>

      {/* 4. TEMPLATES SHOWCASE */}
      <section id="templates" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-brand-400 uppercase tracking-widest font-bold">8 Professionally Crafted Themes</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">Bespoke Design Templates</h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Tailored layouts built for every profession. Switch templates anytime without losing your information.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((t) => (
            <div
              key={t.id}
              className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {t.category}
                  </span>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition">
                  {t.name}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  {t.description}
                </p>
              </div>

              <Link
                to={user ? "/dashboard" : "/register"}
                className="w-full py-2.5 rounded-xl bg-slate-800 group-hover:bg-brand-600 text-white text-xs font-semibold text-center transition"
              >
                Use This Template
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CORE FEATURES */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-brand-400 uppercase tracking-widest font-bold">Uncompromising Engineering</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">Engineered For Professionals</h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Everything you need to showcase your career accomplishments, code, and design work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Parsing",
              desc: "Intelligent extraction of full names, experience, technologies, and certifications with zero hallucination.",
              icon: Cpu
            },
            {
              title: "Multi-Device Live Preview",
              desc: "Preview your website seamlessly across Desktop, Tablet, and Mobile viewports in real time.",
              icon: Laptop
            },
            {
              title: "Custom URLs & Slugs",
              desc: "Get an instantaneous link like yourdomain.com/portfolio/your-name ready to put on LinkedIn.",
              icon: Globe
            },
            {
              title: "Visitor Analytics",
              desc: "Track how many times your portfolio was viewed by recruiters and hiring managers.",
              icon: Eye
            },
            {
              title: "ZIP Source Code Export",
              desc: "Download complete standalone static HTML and CSS code ready to host on Netlify, Vercel, or GitHub.",
              icon: Download
            },
            {
              title: "Enterprise Security",
              desc: "Secure JWT sessions, password hashing, and user ownership validation so your private resumes stay yours.",
              icon: Shield
            }
          ].map((feat, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-6">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-brand-400 uppercase tracking-widest font-bold">Got Questions?</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between text-white font-semibold hover:text-brand-300 transition"
              >
                <span className="text-base sm:text-lg">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-brand-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-6 text-slate-400 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl p-12 sm:p-16 bg-gradient-to-tr from-brand-900/60 via-slate-900 to-indigo-950/60 border border-brand-500/30 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Ready to stand out to employers?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Upload your resume and join thousands of developers and professionals with instant, beautiful personal portfolios.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-base hover:opacity-95 transition shadow-xl shadow-brand-600/30"
          >
            <span>Generate Your Portfolio Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
