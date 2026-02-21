import openai


class EmbeddingService:
    def __init__(self, api_key: str, model: str = "text-embedding-3-small"):
        self.client = openai.AsyncOpenAI(api_key=api_key)
        self.model = model

    async def embed_text(self, text: str) -> list[float]:
        response = await self.client.embeddings.create(
            input=text, model=self.model
        )
        return response.data[0].embedding

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        # OpenAI supports batching up to ~8k tokens per request
        # Process in batches of 100 to stay safe
        all_embeddings = []
        batch_size = 100
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            response = await self.client.embeddings.create(
                input=batch, model=self.model
            )
            all_embeddings.extend([d.embedding for d in response.data])
        return all_embeddings
