import os
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.insert(0, os.path.abspath("."))

from app.services.ai_service import analyze_resume_text, improve_text

print("==================================================")
print("  GROQ API INTEGRATION VERIFICATION")
print("==================================================")
key = os.getenv("GROQ_API_KEY", "")
print(f"GROQ_API_KEY: {key[:8]}...{key[-4:]} (Length: {len(key)})")

sample_resume = """
Ramkrishna Jha
Full Stack Developer & AI Engineer
Email: ramkrishna@example.com
Phone: +1 (555) 012-3456
Location: San Francisco, CA
GitHub: https://github.com/ramkrishna
LinkedIn: https://linkedin.com/in/ramkrishna

Summary:
Results-driven software engineer with 5 years of experience architecting cloud microservices, reactive user interfaces in React, and AI workflow integrations. Passionate about performant and scalable web applications.

Skills:
- Languages: Python, TypeScript, JavaScript, Go, SQL
- Frameworks: React, Next.js, FastAPI, Node.js, Tailwind CSS
- Databases & Cloud: PostgreSQL, Redis, Docker, Kubernetes, AWS

Work Experience:
Senior Software Engineer | CloudVenture (2022 - Present)
- Architected enterprise cloud APIs handling over 20M requests/day with 99.99% availability.
- Led front-end migration to React and TypeScript, accelerating sprint velocity by 40%.

Software Engineer | AlphaLabs (2020 - 2022)
- Built real-time analytics streaming pipelines using Redis and Python.
- Reduced database query latency by 50% via indexing and query optimization.

Education:
Bachelor of Technology in Computer Science & Engineering
Apex University (2016 - 2020)

Projects:
AI Resume-to-Portfolio Platform
- Automated platform converting resumes to responsive web portfolios with AI extraction.
- Integrated LLMs, custom templates, and real-time live preview frames.
"""

print("\nExecuting analyze_resume_text() through Groq API...")
result = analyze_resume_text(sample_resume)

print("\n--- EXTRACTED STRUCTURED PROFILE ---")
print("Candidate Name:      ", result.get("full_name"))
print("Professional Headline:", result.get("professional_headline"))
print("Email:               ", result.get("email"))
print("Location:            ", result.get("location"))
print("Recommended Template:", result.get("recommended_template"))
print("Skills Categories:   ", [c.get("category_name") for c in result.get("skills", [])])
print("Work Experience:     ", len(result.get("work_experience", [])), "roles found")
for exp in result.get("work_experience", []):
    print(f"  • {exp.get('role')} at {exp.get('company')} ({exp.get('start_date')} - {exp.get('end_date')})")
print("Projects:            ", len(result.get("projects", [])), "projects found")
for p in result.get("projects", []):
    print(f"  • {p.get('title')}: {p.get('description')[:60]}...")

print("\nTesting improve_text() via Groq...")
improved = improve_text("headline", "Full Stack Developer", "executive")
print("Original headline: 'Full Stack Developer'")
print("Improved headline: ", f"'{improved}'")

print("\n[SUCCESS] Groq API is functioning properly with your API key!")
