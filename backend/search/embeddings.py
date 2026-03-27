from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from typing import Iterable, List

from django.conf import settings


@dataclass(frozen=True)
class EmbeddingResult:
    vector: list[float]
    provider: str
    model: str


@lru_cache(maxsize=1)
def _local_model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(settings.LOCAL_EMBEDDINGS_MODEL)


def embed_text(text: str) -> EmbeddingResult:
    provider = settings.EMBEDDINGS_PROVIDER
    text = (text or "").strip()
    if not text:
        return EmbeddingResult(vector=[0.0] * 384, provider=provider, model="empty")

    if provider == "openai":
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY is required for EMBEDDINGS_PROVIDER=openai")
        from openai import OpenAI

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        resp = client.embeddings.create(model=settings.OPENAI_EMBEDDINGS_MODEL, input=text)
        vec = list(resp.data[0].embedding)
        return EmbeddingResult(vector=vec, provider="openai", model=settings.OPENAI_EMBEDDINGS_MODEL)

    # default: local
    model = _local_model()
    vec = model.encode([text], normalize_embeddings=True)[0].tolist()
    return EmbeddingResult(vector=vec, provider="local", model=settings.LOCAL_EMBEDDINGS_MODEL)


def embed_many(texts: Iterable[str]) -> List[list[float]]:
    provider = settings.EMBEDDINGS_PROVIDER
    texts = [t.strip() for t in texts]
    if provider == "openai":
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY is required for EMBEDDINGS_PROVIDER=openai")
        from openai import OpenAI

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        resp = client.embeddings.create(model=settings.OPENAI_EMBEDDINGS_MODEL, input=texts)
        return [list(item.embedding) for item in resp.data]

    model = _local_model()
    arr = model.encode(texts, normalize_embeddings=True)
    return [row.tolist() for row in arr]

