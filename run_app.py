"""
Unified launcher script for AI Resume-to-Portfolio Website Generator.
Starts both the FastAPI backend and Vite React frontend concurrently.
"""
import subprocess
import sys
import time
import os

def main():
    print("================================================================")
    print("  AI RESUME-TO-PORTFOLIO GENERATOR - DEV LAUNCHER")
    print("================================================================")
    print("Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--reload", "--host", "127.0.0.1", "--port", "8000"],
        cwd=os.path.abspath("backend")
    )

    time.sleep(2)

    print("Starting Vite React Frontend on http://127.0.0.1:5173 ...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=os.path.abspath("frontend")
    )

    print("\n[READY]")
    print("Frontend App:       http://localhost:5173")
    print("Backend API & Docs: http://127.0.0.1:8000/docs")
    print("Admin Credentials:  demo@example.com / password123")
    print("\nPress Ctrl+C to stop both servers.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    main()
