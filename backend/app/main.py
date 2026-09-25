from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import health, dashboard, lessons, exercises, users, dev

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL], # Dynamically loaded from env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root level health check requested in prompt: GET /health
@app.get("/health", tags=["health"])
def health_root():
    return {"status": "ok", "message": "Duolingo Clone API is running"}

# API Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])
app.include_router(dashboard.router, prefix=settings.API_V1_STR, tags=["dashboard"])
app.include_router(lessons.router, prefix=f"{settings.API_V1_STR}/lessons", tags=["lessons"])
app.include_router(exercises.router, prefix=f"{settings.API_V1_STR}/exercises", tags=["exercises"])
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(dev.router, prefix=f"{settings.API_V1_STR}/dev", tags=["dev"])

@app.get("/")
def root():
    return {"message": "Welcome to the Duolingo Clone API", "docs": "/docs"}
