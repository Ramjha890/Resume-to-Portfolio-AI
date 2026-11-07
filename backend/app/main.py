import json
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import PROJECT_NAME, UPLOAD_DIR
from app.core.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models.models import User, PortfolioTemplate
from app.api import auth, resumes, ai, portfolios, public, analytics, admin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

DEFAULT_TEMPLATES = [
    {
        "id": "modern-developer",
        "template_name": "Modern Developer",
        "category": "Engineering",
        "description": "Terminal-inspired accents, sleek dark UI, monospace badges, and high-contrast engineering focus.",
        "configuration": json.dumps({"theme": "dark", "primary": "#8b5cf6", "font": "Inter"})
    },
    {
        "id": "minimal-professional",
        "template_name": "Minimal Professional",
        "category": "Corporate",
        "description": "Clean, spacious layout with elegant serif headings, balanced whitespace, and crisp monochromatic tones.",
        "configuration": json.dumps({"theme": "light", "primary": "#0f172a", "font": "Playfair Display"})
    },
    {
        "id": "dark-premium",
        "template_name": "Dark Premium",
        "category": "Cyber & Systems",
        "description": "Deep obsidian backdrop with glowing emerald and cyan neon borders, built for high-tech operators.",
        "configuration": json.dumps({"theme": "dark", "primary": "#10b981", "font": "Inter"})
    },
    {
        "id": "creative-designer",
        "template_name": "Creative Designer",
        "category": "Design & UI/UX",
        "description": "Vibrant sunset gradients, playful typography, visual showcase cards, and bold interactive elements.",
        "configuration": json.dumps({"theme": "dark", "primary": "#f43f5e", "font": "Space Grotesk"})
    },
    {
        "id": "ai-engineer",
        "template_name": "AI Engineer",
        "category": "AI & Data Science",
        "description": "Electric indigo neural motifs, benchmark metrics, model highlights, and research publication tags.",
        "configuration": json.dumps({"theme": "dark", "primary": "#6366f1", "font": "Inter"})
    },
    {
        "id": "student-portfolio",
        "template_name": "Student Portfolio",
        "category": "Academic",
        "description": "Fresh, energetic layout highlighting coursework, academic accolades, hackathons, and early internships.",
        "configuration": json.dumps({"theme": "light", "primary": "#0284c7", "font": "Plus Jakarta Sans"})
    },
    {
        "id": "corporate-professional",
        "template_name": "Corporate Professional",
        "category": "Executive",
        "description": "Authoritative navy with subtle gold accents, executive summary spotlight, and leadership impact metrics.",
        "configuration": json.dumps({"theme": "dark", "primary": "#eab308", "font": "Inter"})
    },
    {
        "id": "glassmorphism",
        "template_name": "Glassmorphism Portfolio",
        "category": "Modernist",
        "description": "Ethereal frosted glass blur panels, ambient mesh gradients, and floating futuristic cards.",
        "configuration": json.dumps({"theme": "dark", "primary": "#a855f7", "font": "Inter"})
    }
]

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed templates
        for t in DEFAULT_TEMPLATES:
            existing = db.query(PortfolioTemplate).filter(PortfolioTemplate.id == t["id"]).first()
            if not existing:
                template_record = PortfolioTemplate(
                    id=t["id"],
                    template_name=t["template_name"],
                    category=t["category"],
                    description=t["description"],
                    configuration=t["configuration"]
                )
                db.add(template_record)
        
        # Seed a default demo admin user if database is empty
        user_count = db.query(User).count()
        if user_count == 0:
            demo_user = User(
                full_name="Alex Mercer",
                email="demo@example.com",
                password_hash=get_password_hash("password123"),
                is_admin=True
            )
            db.add(demo_user)
            logger.info("Created default demo user: demo@example.com / password123")

        db.commit()
    except Exception as e:
        logger.error(f"Database init error: {e}")
        db.rollback()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=PROJECT_NAME,
    description="Production-grade AI Resume-to-Portfolio Website Generator API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for file uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(resumes.router)
app.include_router(ai.router)
app.include_router(portfolios.router)
app.include_router(public.router)
app.include_router(analytics.router)
app.include_router(admin.router)

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# Serve Frontend SPA in Production (e.g. Render / Single Service deployment)
from fastapi.responses import FileResponse
from fastapi import HTTPException
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"

if FRONTEND_DIST.exists() and (FRONTEND_DIST / "index.html").exists():
    logger.info(f"Mounting frontend production build from {FRONTEND_DIST}")
    if (FRONTEND_DIST / "assets").exists():
        app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="frontend-assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json") or full_path.startswith("uploads"):
            raise HTTPException(status_code=404, detail="Endpoint not found")
        
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/")
    def root():
        return {
            "app": PROJECT_NAME,
            "status": "online",
            "docs": "/docs",
            "version": "1.0.0"
        }
