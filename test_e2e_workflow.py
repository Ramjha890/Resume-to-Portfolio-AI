import os
import sys
import io
import zipfile
from fastapi.testclient import TestClient

# Ensure backend path is in sys.path
sys.path.insert(0, os.path.abspath("backend"))

from app.main import app, init_db

init_db()
client = TestClient(app)

def run_tests():
    print("=== STARTING COMPLETE E2E WORKFLOW TESTS ===")

    import time
    ts = int(time.time())
    email1 = f"ramkrishna.{ts}@example.com"
    email2 = f"sarah.{ts}@example.com"

    # 1. Register User 1
    reg_res = client.post("/api/auth/register", json={
        "full_name": "Ramkrishna Jha",
        "email": email1,
        "password": "securepassword123"
    })
    assert reg_res.status_code == 201, f"User 1 registration failed: {reg_res.text}"
    user1_data = reg_res.json()
    token1 = user1_data["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}
    print("[PASS] User 1 registered successfully.")

    # 2. Login User 1
    login_res = client.post("/api/auth/login", json={
        "email": email1,
        "password": "securepassword123"
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    print("[PASS] User 1 logged in successfully.")

    # 3. Verify /api/auth/me
    me_res = client.get("/api/auth/me", headers=headers1)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email1
    print("[PASS] Verified /api/auth/me.")

    # 4. Upload Resume Document (Create sample PDF in memory with PyMuPDF)
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    sample_resume_text = """Ramkrishna Jha
Full Stack Developer & AI Engineer
Email: ramkrishna.jha@example.com
Phone: +1 (555) 234-5678
Location: San Francisco, CA
GitHub: https://github.com/ramkrishnajha
LinkedIn: https://linkedin.com/in/ramkrishnajha

Summary:
Experienced Full Stack Engineer with 4+ years architecting scalable cloud applications, distributed microservices, and AI-driven platforms. Passionate about performant user interfaces and reliable backend systems.

Technical Skills:
Languages: TypeScript, Python, Go, SQL, HTML5, CSS3
Frameworks & Libraries: React, Next.js, FastAPI, Node.js, Tailwind CSS
Cloud & DevOps: Docker, Kubernetes, AWS, PostgreSQL, Redis, Git

Work Experience:
Senior Software Engineer | CloudScale Systems (2022 - Present)
- Architected distributed backend services processing over 50M requests per day with 99.99% uptime.
- Led front-end migration to React and TypeScript, accelerating release velocity by 35%.

Software Engineer | DevMatrix Labs (2020 - 2022)
- Built enterprise customer analytics dashboard used by Fortune 500 clients.
- Optimized PostgreSQL database queries, reducing average API response latency from 320ms to 45ms.

Education:
Bachelor of Science in Computer Science
University of Technology (2016 - 2020)
- Graduated with First Class Distinction.

Projects:
AI Document Intelligence Platform
- Built end-to-end multimodal resume extraction system using modern LLM APIs and vector embeddings.
- Deployed on AWS with auto-scaling container infrastructure.
"""
    page.insert_text((50, 72), sample_resume_text, fontsize=10)
    pdf_bytes = doc.write()
    doc.close()

    upload_res = client.post(
        "/api/resumes/upload",
        headers=headers1,
        files={"file": ("ramkrishna_resume.pdf", pdf_bytes, "application/pdf")}
    )
    assert upload_res.status_code == 201, f"Upload failed: {upload_res.text}"
    resume_obj = upload_res.json()
    resume_id = resume_obj["id"]
    print(f"[PASS] Resume uploaded successfully. ID: {resume_id}, File: {resume_obj['original_filename']}")

    # 5. Analyze Resume with AI / Heuristics
    ai_res = client.post("/api/ai/analyze-resume", headers=headers1, json={"resume_id": resume_id})
    assert ai_res.status_code == 200, f"AI analysis failed: {ai_res.text}"
    structured = ai_res.json()["structured_resume"]
    recommended_tmpl = ai_res.json()["recommended_template"]
    assert "Ramkrishna" in structured["full_name"], "Name not extracted properly"
    print(f"[PASS] AI Analysis structured data: Name={structured['full_name']}, Recommended Template={recommended_tmpl}")

    # 6. Generate Portfolio Data
    gen_res = client.post("/api/ai/generate-portfolio", headers=headers1, json={
        "resume_id": resume_id,
        "structured_resume": structured,
        "preferred_template": "modern-developer"
    })
    assert gen_res.status_code == 200, f"Portfolio generation failed: {gen_res.text}"
    gen_data = gen_res.json()
    print("[PASS] Generated canonical portfolio schema.")

    # 7. Create Portfolio
    create_res = client.post("/api/portfolios", headers=headers1, json={
        "portfolio_name": gen_data["portfolio_name"],
        "template_id": gen_data["template_id"],
        "portfolio_data": gen_data["portfolio_data"]
    })
    assert create_res.status_code == 201, f"Portfolio creation failed: {create_res.text}"
    created_portfolio = create_res.json()
    portfolio_id = created_portfolio["id"]
    slug = created_portfolio["slug"]
    print(f"[PASS] Created Portfolio ID: {portfolio_id}, Slug: {slug}")

    # 8. Update Portfolio & Switch Template
    p_data_to_update = created_portfolio["portfolio_data"]
    p_data_to_update["hero"]["headline"] = "Principal Engineer & AI Architect"
    update_res = client.put(f"/api/portfolios/{portfolio_id}", headers=headers1, json={
        "template_id": "dark-premium",
        "portfolio_data": p_data_to_update
    })
    assert update_res.status_code == 200
    assert update_res.json()["template_id"] == "dark-premium"
    assert update_res.json()["portfolio_data"]["hero"]["headline"] == "Principal Engineer & AI Architect"
    print("[PASS] Updated portfolio data and switched template to dark-premium.")

    # 9. Test Public Access before publish (must be 403 Forbidden)
    pub_before = client.get(f"/api/public/portfolio/{slug}")
    assert pub_before.status_code == 403, "Unpublished portfolio should not be publicly accessible!"
    print("[PASS] Verified unpublished portfolio access is restricted.")

    # 10. Publish Portfolio
    publish_res = client.post(f"/api/portfolios/{portfolio_id}/publish", headers=headers1)
    assert publish_res.status_code == 200
    assert publish_res.json()["is_published"] is True
    print(f"[PASS] Published portfolio live at /portfolio/{slug}.")

    # 11. Test Public Access after publish (must be 200 OK and increment views)
    pub_after_1 = client.get(f"/api/public/portfolio/{slug}")
    assert pub_after_1.status_code == 200
    assert pub_after_1.json()["visitor_count"] == 1

    # Second visitor
    pub_after_2 = client.get(f"/api/public/portfolio/{slug}")
    assert pub_after_2.status_code == 200
    assert pub_after_2.json()["visitor_count"] == 2
    print(f"[PASS] Public portfolio accessible anonymously. Visitor count properly incremented to 2.")

    # 12. Test Export ZIP Bundle
    zip_res = client.get(f"/api/portfolios/{portfolio_id}/export-zip", headers=headers1)
    assert zip_res.status_code == 200
    assert zip_res.headers["content-type"] == "application/zip"
    # Inspect zip contents in memory
    zf = zipfile.ZipFile(io.BytesIO(zip_res.content))
    zip_namelist = zf.namelist()
    assert "index.html" in zip_namelist, "index.html missing from zip bundle!"
    assert "portfolio.json" in zip_namelist, "portfolio.json missing from zip bundle!"
    assert "README.md" in zip_namelist, "README.md missing from zip bundle!"
    print(f"[PASS] Export ZIP bundle verified. Contained: {zip_namelist}")

    # 13. Test Multi-User Isolation & Security
    # Register User 2
    reg_u2 = client.post("/api/auth/register", json={
        "full_name": "Sarah Connor",
        "email": email2,
        "password": "password456"
    })
    token2 = reg_u2.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # User 2 tries to GET or DELETE User 1's portfolio -> must return 404/denied
    u2_get = client.get(f"/api/portfolios/{portfolio_id}", headers=headers2)
    assert u2_get.status_code == 404, "Security violation: User 2 accessed User 1's portfolio!"

    u2_del = client.delete(f"/api/portfolios/{portfolio_id}", headers=headers2)
    assert u2_del.status_code == 404, "Security violation: User 2 deleted User 1's portfolio!"

    # User 2 tries to delete User 1's resume
    u2_del_res = client.delete(f"/api/resumes/{resume_id}", headers=headers2)
    assert u2_del_res.status_code == 404, "Security violation: User 2 deleted User 1's resume!"
    print("[PASS] User isolation and security verified. Cross-user access properly blocked.")

    # 14. Admin Dashboard Security and Stats
    # Non-admin user tries to access /api/admin/stats -> must be 403 Forbidden
    non_admin_stats = client.get("/api/admin/stats", headers=headers2)
    assert non_admin_stats.status_code == 403, "Non-admin user accessed admin stats!"

    # Test with default admin account: demo@example.com / password123
    admin_login = client.post("/api/auth/login", json={
        "email": "demo@example.com",
        "password": "password123"
    })
    assert admin_login.status_code == 200, f"Admin login failed: {admin_login.text}"
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    admin_stats = client.get("/api/admin/stats", headers=admin_headers)
    assert admin_stats.status_code == 200
    st = admin_stats.json()
    assert st["total_users"] >= 2
    assert st["total_portfolios"] >= 1
    assert st["total_views"] >= 2
    print(f"[PASS] Admin stats verified: Total Users={st['total_users']}, Portfolios={st['total_portfolios']}, Views={st['total_views']}")

    print("\nALL 14 END-TO-END WORKFLOW TESTS PASSED SUCCESSFULLY! [SUCCESS]")

if __name__ == "__main__":
    run_tests()
