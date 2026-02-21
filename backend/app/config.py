from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://smartchat:smartchat_dev@localhost:5432/smartchat"
    openai_api_key: str = ""

    # LLM defaults
    default_model: str = "gpt-4o-mini"
    default_temperature: float = 0.7
    default_max_tokens: int = 1024
    default_system_prompt: str = "You are a helpful assistant."

    # Embedding
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536

    # Chunking
    chunk_size: int = 500
    chunk_overlap: int = 50

    # RAG
    top_k_results: int = 5

    model_config = {"env_file": "../.env", "extra": "ignore"}


settings = Settings()
