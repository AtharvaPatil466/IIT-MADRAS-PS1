from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    anthropic_api_key: str = ""
    claude_model: str = "claude-sonnet-4-6"
    # Ollama (local LLM) — used for dev/demo; swap back to Claude for final.
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:latest"
    ollama_timeout_s: float = 60.0
    database_path: str = "./db/drivelegal.db"
    chroma_path: str = "./chroma"
    default_country: str = "IN"
    log_level: str = "INFO"


settings = Settings()
