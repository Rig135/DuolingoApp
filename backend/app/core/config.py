from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Duolingo Clone API"
    API_V1_STR: str = "/api"
    SQLITE_URL: str = "sqlite:///./duolingo.db"

settings = Settings()
