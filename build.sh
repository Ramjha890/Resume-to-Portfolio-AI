#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "========================================="
echo "   STARTING RENDER BUILD SCRIPT"
echo "========================================="

# 1. Build Frontend React App
echo "--> Installing Node.js dependencies..."
cd frontend
npm install
echo "--> Building production Vite frontend..."
npm run build
cd ..

# 2. Install Python Backend Dependencies
echo "--> Installing Python backend requirements..."
python -m pip install --upgrade pip
pip install -r backend/requirements.txt

echo "========================================="
echo "   RENDER BUILD COMPLETED SUCCESSFULLY!"
echo "========================================="
