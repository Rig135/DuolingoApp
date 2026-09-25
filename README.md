# Duolingo Clone

## Overview
This is a full-stack clone of the Duolingo web application. 
It features a Next.js frontend and a FastAPI backend with SQLite.

## Project Structure
- `frontend/`: Next.js application (React, TypeScript, Tailwind CSS)
- `backend/`: FastAPI application (Python, SQLAlchemy, SQLite)

## Setup & Running Locally

### Backend
1. cd into `backend/`
2. Create virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `uvicorn app.main:app --reload`
The API will run on http://localhost:8000

### Frontend
1. cd into `frontend/`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
The Web app will run on http://localhost:3000
