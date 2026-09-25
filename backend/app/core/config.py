from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Duolingo Clone API"
    API_V1_STR: str = "/api"
    SQLITE_URL: str = "sqlite:///./duolingo.db"
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()
