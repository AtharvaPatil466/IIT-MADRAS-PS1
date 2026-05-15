from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    anthropic_api_key: str = ""
    claude_model: str = "claude-sonnet-4-6"
    database_path: str = "./db/drivelegal.db"
    chroma_path: str = "./chroma"
    default_country: str = "IN"
    log_level: str = "INFO"


settings = Settings()
