from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATA_DIR: Path = Path(__file__).parent.parent / "data"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

settings = Settings()