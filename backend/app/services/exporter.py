import io
import json
import zipfile
from typing import Dict, Any, List

def render_highlights(highlights: List[str]) -> str:
    if not highlights:
        return ""
    items = "".join([f'<li class="text-slate-300 text-sm leading-relaxed">{h}</li>' for h in highlights])
    return f'<ul class="list-disc list-inside space-y-1.5 mt-3">{items}</ul>'

def render_projects_html(projects: List[Dict[str, Any]]) -> str:
    cards = []
    for p in projects:
        title = p.get('title', 'Project')
        desc = p.get('description', '')
        tags = p.get('tags', [])
        live = p.get('live_url', '')
        github = p.get('github_url', '')

        tags_html = "".join([f'<span class="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">{t}</span>' for t in tags])
        links_html = ""
        if live:
            links_html += f'<a href="{live}" target="_blank" rel="noopener" class="accent-text font-semibold hover:underline">Live Demo &rarr;</a>'
        if github:
            links_html += f'<a href="{github}" target="_blank" rel="noopener" class="text-slate-400 hover:text-white transition">Source Code</a>'

        card = f'''
        <div class="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition">
          <div>
            <h3 class="text-xl font-bold mb-3">{title}</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>
            <div class="flex flex-wrap gap-2 mb-6">{tags_html}</div>
          </div>
          <div class="flex items-center gap-4 pt-4 border-t border-white/10 text-sm">{links_html}</div>
        </div>
        '''
        cards.append(card)
    return "".join(cards)

def render_skills_html(skills: List[Dict[str, Any]]) -> str:
    cards = []
    for cat in skills:
        cat_name = cat.get('category_name', 'Skills')
        cat_skills = cat.get('skills', [])
        pills = "".join([f'<span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium">{s}</span>' for s in cat_skills])
        card = f'''
        <div class="glass-card rounded-2xl p-6">
          <h3 class="text-lg font-semibold mb-4 text-purple-300">{cat_name}</h3>
          <div class="flex flex-wrap gap-2">{pills}</div>
        </div>
        '''
        cards.append(card)
    return "".join(cards)

def render_experience_html(experience: List[Dict[str, Any]]) -> str:
    cards = []
    for exp in experience:
        role = exp.get('role', '')
        company = exp.get('company', '')
        start = exp.get('start_date', '')
        end = exp.get('end_date', 'Present')
        desc = exp.get('description', '')
        hl_html = render_highlights(exp.get('highlights', []))

        card = f'''
        <div class="glass-card rounded-2xl p-6 md:p-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold">{role}</h3>
              <p class="accent-text font-medium">{company}</p>
            </div>
            <span class="text-sm text-slate-400 mt-2 md:mt-0">{start} - {end}</span>
          </div>
          <p class="text-slate-300 text-sm leading-relaxed mb-2">{desc}</p>
          {hl_html}
        </div>
        '''
        cards.append(card)
    return "".join(cards)

def render_education_html(education: List[Dict[str, Any]]) -> str:
    cards = []
    for edu in education:
        deg = edu.get('degree', '')
        inst = edu.get('institution', '')
        start = edu.get('start_date', '')
        end = edu.get('end_date', '')
        card = f'''
        <div class="glass-card rounded-2xl p-6">
          <h3 class="text-lg font-bold">{deg}</h3>
          <p class="accent-text text-sm font-medium mb-2">{inst}</p>
          <span class="text-xs text-slate-400">{start} - {end}</span>
        </div>
        '''
        cards.append(card)
    return "".join(cards)


def generate_portfolio_html(portfolio_name: str, template_id: str, data: Dict[str, Any]) -> str:
    """Generate self-contained standalone HTML portfolio page."""
    hero = data.get("hero", {})
    about = data.get("about", {})
    skills = data.get("skills", [])
    projects = data.get("projects", [])
    experience = data.get("work_experience", [])
    education = data.get("education", [])
    contact = data.get("contact", {})
    social = data.get("social_links", {})
    styling = data.get("styling", {})
    visibility = data.get("section_visibility", {})

    theme_bg = "#070b14" if styling.get("theme_mode", "dark") == "dark" else "#f8fafc"
    text_color = "#f8fafc" if styling.get("theme_mode", "dark") == "dark" else "#0f172a"
    accent_color = styling.get("primary_color", "#8b5cf6")
    card_bg = "rgba(30, 41, 59, 0.6)" if styling.get("theme_mode", "dark") == "dark" else "#ffffff"
    border_color = "rgba(255, 255, 255, 0.1)" if styling.get("theme_mode", "dark") == "dark" else "#e2e8f0"

    projects_content = render_projects_html(projects) if (visibility.get('projects', True) and projects) else ""
    skills_content = render_skills_html(skills) if (visibility.get('skills', True) and skills) else ""
    experience_content = render_experience_html(experience) if (visibility.get('work_experience', True) and experience) else ""
    education_content = render_education_html(education) if (visibility.get('education', True) and education) else ""

    avail_badge = ""
    if hero.get('open_to_work', True):
        avail_badge = '''<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Available for Opportunities
    </div>'''

    social_links_html = ""
    if social.get("github"):
        social_links_html += f'<a href="{social.get("github")}" target="_blank" rel="noopener" class="hover:text-white transition">GitHub</a>'
    if social.get("linkedin"):
        social_links_html += f'<a href="{social.get("linkedin")}" target="_blank" rel="noopener" class="hover:text-white transition">LinkedIn</a>'
    if social.get("twitter"):
        social_links_html += f'<a href="{social.get("twitter")}" target="_blank" rel="noopener" class="hover:text-white transition">Twitter / X</a>'
    if social.get("portfolio"):
        social_links_html += f'<a href="{social.get("portfolio")}" target="_blank" rel="noopener" class="hover:text-white transition">Portfolio</a>'

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{hero.get('name', 'Portfolio')} | {hero.get('headline', 'Professional Portfolio')}</title>
  <meta name="description" content="{hero.get('summary', '')}" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    body {{
      background-color: {theme_bg};
      color: {text_color};
      font-family: '{styling.get("font_family", "Inter")}', sans-serif;
    }}
    .accent-bg {{ background-color: {accent_color}; }}
    .accent-text {{ color: {accent_color}; }}
    .glass-card {{
      background: {card_bg};
      border: 1px solid {border_color};
      backdrop-filter: blur(12px);
    }}
  </style>
</head>
<body class="min-h-screen selection:bg-purple-500 selection:text-white">

  <nav class="sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
    <a href="#" class="text-xl font-bold tracking-tight accent-text">{hero.get('name', 'Portfolio')}</a>
    <div class="flex items-center space-x-6 text-sm">
      <a href="#about" class="hover:text-purple-400 transition">About</a>
      <a href="#projects" class="hover:text-purple-400 transition">Projects</a>
      <a href="#skills" class="hover:text-purple-400 transition">Skills</a>
      <a href="#experience" class="hover:text-purple-400 transition">Experience</a>
      <a href="#contact" class="px-4 py-2 rounded-full accent-bg text-white font-medium hover:opacity-90 transition">Contact</a>
    </div>
  </nav>

  <header class="max-w-5xl mx-auto px-6 py-24 text-center">
    {avail_badge}
    <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">{hero.get('name', 'Your Name')}</h1>
    <p class="text-xl md:text-2xl font-medium accent-text mb-6 max-w-2xl mx-auto">{hero.get('headline', '')}</p>
    <p class="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">{hero.get('summary', '')}</p>
    
    <div class="flex flex-wrap items-center justify-center gap-4">
      <a href="#projects" class="px-8 py-3.5 rounded-xl accent-bg text-white font-semibold shadow-lg hover:opacity-90 transition">View My Projects</a>
      <a href="#contact" class="px-8 py-3.5 rounded-xl border border-white/20 font-semibold hover:bg-white/5 transition">Get In Touch</a>
    </div>

    <div class="flex items-center justify-center gap-6 mt-12 text-slate-400">
      {social_links_html}
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-6 space-y-24 pb-24">

    <!-- About Section -->
    <section id="about" class="glass-card rounded-2xl p-8 md:p-12">
      <h2 class="text-3xl font-bold mb-6">About Me</h2>
      <p class="text-slate-300 text-lg leading-relaxed mb-6">{about.get('bio') or hero.get('summary', '')}</p>
    </section>

    <!-- Projects Section -->
    <section id="projects">
      <div class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-3">Featured Projects</h2>
        <p class="text-slate-400">Production-ready applications and software projects</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects_content}
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills">
      <div class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-3">Skills & Technical Expertise</h2>
        <p class="text-slate-400">Technologies and tooling I leverage</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skills_content}
      </div>
    </section>

    <!-- Work Experience Section -->
    <section id="experience">
      <div class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-3">Work Experience</h2>
        <p class="text-slate-400">Professional trajectory and contributions</p>
      </div>
      <div class="space-y-6">
        {experience_content}
      </div>
    </section>

    <!-- Education Section -->
    <section id="education">
      <div class="mb-8">
        <h2 class="text-3xl font-bold mb-2">Education</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education_content}
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="glass-card rounded-3xl p-8 md:p-14 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">{contact.get('title', 'Get In Touch')}</h2>
      <p class="text-slate-400 max-w-lg mx-auto mb-8">{contact.get('subtitle', 'Interested in collaborating? Feel free to reach out!')}</p>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <a href="mailto:{contact.get('email') or hero.get('email', '')}" class="px-8 py-3.5 rounded-xl accent-bg text-white font-semibold shadow-lg hover:opacity-90 transition">Send an Email</a>
      </div>
    </section>

  </main>

  <footer class="border-t border-white/10 py-10 text-center text-sm text-slate-500">
    <p>&copy; {hero.get('name', 'Portfolio')}. Generated with PortfolioCraft AI.</p>
  </footer>

</body>
</html>
"""
    return html


def create_portfolio_zip_bundle(portfolio_name: str, template_id: str, data: Dict[str, Any]) -> io.BytesIO:
    """Generate zip file in memory with HTML, JSON data, and README."""
    html_content = generate_portfolio_html(portfolio_name, template_id, data)
    json_content = json.dumps(data, indent=2)
    readme_content = f"""# {portfolio_name} Portfolio Bundle
Generated by AI Resume-to-Portfolio Generator

## Contents:
- index.html: Fully standalone, responsive portfolio website. Double-click to open in any web browser!
- portfolio.json: Structured JSON data of your portfolio.

## How to Deploy for Free:
1. GitHub Pages:
   - Create a repository named `<your-username>.github.io`
   - Upload `index.html` to the repository root
   - Your website is instantly live at https://<your-username>.github.io!

2. Netlify:
   - Go to https://app.netlify.com/drop
   - Drag and drop this extracted folder
   - Your portfolio is live in 10 seconds!

3. Vercel:
   - Run `npx vercel` inside this folder or import from GitHub.
"""

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("index.html", html_content)
        z.writestr("portfolio.json", json_content)
        z.writestr("README.md", readme_content)
    zip_buffer.seek(0)
    return zip_buffer
