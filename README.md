# AI Resume-to-Portfolio Website Generator

> **Tagline**: "Upload Your Resume. Get Your Professional Portfolio Website Instantly."

A production-ready SaaS application that automatically analyzes PDF and DOCX resumes with AI and transforms them into responsive, customizable, and shareable personal portfolio websites with live multi-device previews, 8 distinct bespoke design templates, one-click publishing, and standalone ZIP exports.

---

## 🌟 Key Features

### 1. Resume Processing & Analysis
- **Drag-and-Drop Uploader**: Supports `.pdf` and `.docx` files with file-size and type validation.
- **Deep Text Extraction**: Uses PyMuPDF (`fitz`), `python-docx`, and fallback extractors.
- **AI-Powered Analysis**: Configured for **Groq API** (`llama-3.3-70b-versatile`) and OpenAI-compatible providers, with an intelligent built-in heuristic parser ensuring 100% uptime even without an API key.
- **Strict Anti-Hallucination**: Extracts genuine skills, experience, education, and links without inventing false achievements or qualifications.

### 2. Bespoke Portfolio Templates (8 Unique Themes)
1. **Modern Developer**: Terminal-inspired dark UI, monospace accents, badge highlights, and tech-stack pills.
2. **Minimal Professional**: Editorial serif typography, crisp whitespace, and elegant monochromatic design.
3. **Dark Premium**: Obsidian background with cyber emerald glowing accents for systems engineers and cybersecurity pros.
4. **Creative Designer**: Sunset gradients, playful typography, visual card showcases, and asymmetric layout.
5. **AI Engineer**: Neural net motifs, electric indigo palettes, benchmark metrics, and research tags.
6. **Student Portfolio**: Fresh layout spotlighting academic degrees, coursework, hackathons, and early internships.
7. **Corporate Professional**: Authoritative navy with subtle gold highlights, executive summary spotlights, and leadership metrics.
8. **Glassmorphism Portfolio**: Frosted glass cards with backdrop blur, ambient mesh gradients, and floating futuristic elements.

### 3. Live Editor & Multi-Device Preview
- **Interactive Device Viewports**: Desktop (100%), Tablet (768px frame), and Mobile (375px frame).
- **In-Place Live Content Editing**: Full editing of hero, about bio, skills, work experience, projects, education, certifications, and social links.
- **Section Visibility & Reordering**: Hide or display any section with one click.
- **AI Polish Tool**: One-click AI polishing of headlines, bios, and project descriptions.

### 4. Publishing & Sharing
- **Unique Public URLs**: Instant public URL at `/portfolio/:slug` (e.g. `/portfolio/ramkrishna-jha`).
- **Visitor Analytics**: Tracks view impressions and last visited timestamps.
- **Standalone ZIP Export**: Generates and downloads an offline, self-contained HTML/CSS bundle ready to host on GitHub Pages, Netlify, or Vercel for free with zero vendor lock-in.
- **Confetti Celebration**: Visual feedback upon publishing.

### 5. Multi-User & Security
- **JWT Authentication & Password Hashing**: Robust Bcrypt password hashing and expiration tokens.
- **Strict Data Isolation**: Full ownership verification on all private resumes and portfolios.
- **Admin Dashboard**: Superuser view (`/admin`) displaying total users, resumes, portfolios, views, activity stream, and portfolio metrics.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti.
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Pydantic v2, PyMuPDF, python-docx, PyJWT, Bcrypt.
- **Database**: SQLite (instant zero-config local run) & PostgreSQL (production-ready).
- **AI Engine**: Groq API / OpenAI-compatible endpoint with intelligent fallback heuristics.

---

## 🚀 Quick Start Guide (Windows / Mac / Linux)

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Launching with One Command
Run the unified launcher in your terminal:
```bash
python run_app.py
```
This automatically starts:
- **FastAPI Backend**: `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`)
- **Vite React Frontend**: `http://localhost:5173`

---

### Manual Launching (Optional)

#### Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### Frontend
```bash
cd frontend
npm run dev
```

---

## 🔑 Default Demo & Admin Account

When first launched, the application seeds a default demo administrator account:
- **Email**: `demo@example.com`
- **Password**: `password123`

You can also click the **"Click to fill Demo Admin"** shortcut on the login page!

---

## ⚙️ Environment Variables (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | SQLite or PostgreSQL connection string | `sqlite:///./portfolio_app.db` |
| `SECRET_KEY` | JWT signing secret | Secure key |
| `GROQ_API_KEY` | Groq API key (free at console.groq.com) | `""` (fallback parser active) |
| `GROQ_MODEL` | Groq model identifier | `llama-3.3-70b-versatile` |
| `MAX_UPLOAD_SIZE_MB` | Maximum allowed file upload size | `15` |

---

## 🧪 Automated End-to-End Testing

To run the complete automated test suite verifying all 14 workflow steps (registration, login, PDF upload, AI extraction, portfolio generation, editing, publishing, anonymous public viewing, visitor incrementing, ZIP bundle export, and access control isolation):

```bash
python test_e2e_workflow.py
```
All 14 tests run in under 15 seconds with verified passes.

---

## 📦 Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `frontend/dist` folder to Netlify, Vercel, or Cloudflare Pages.
3. Configure the `VITE_API_BASE` or proxy rules pointing to your backend URL.

### Backend Deployment (Render / Railway / Fly.io)
1. Push repository to GitHub.
2. Create a Web Service on Render or Railway with Root Directory set to `backend`.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set `DATABASE_URL` to your PostgreSQL database instance.
