import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import KnowledgeSource, DocumentChunk
from app.services.embedding_service import EmbeddingService


class RAGService:
    def __init__(
        self,
        db: AsyncSession,
        embedding_service: EmbeddingService,
        top_k: int = 5,
    ):
        self.db = db
        self.embedding_service = embedding_service
        self.top_k = top_k

    async def retrieve(self, query: str, tenant_id: uuid.UUID) -> list[dict]:
        query_embedding = await self.embedding_service.embed_text(query)

        stmt = (
            select(
                DocumentChunk.content,
                DocumentChunk.metadata_json,
                DocumentChunk.embedding.cosine_distance(query_embedding).label("distance"),
            )
            .join(KnowledgeSource, DocumentChunk.source_id == KnowledgeSource.id)
            .where(KnowledgeSource.tenant_id == tenant_id)
            .where(KnowledgeSource.status == "ready")
            .order_by("distance")
            .limit(self.top_k)
        )

        result = await self.db.execute(stmt)
        rows = result.all()

        return [
            {"content": r.content, "metadata": r.metadata_json, "distance": r.distance}
            for r in rows
        ]
