from __future__ import annotations

from django.db.models import F
from pgvector.django import CosineDistance
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product
from catalog.serializers import ProductSerializer

from .embeddings import embed_text


class SemanticSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        q = (request.query_params.get("q") or "").strip()
        if not q:
            return Response({"results": [], "q": q})

        emb = embed_text(q).vector
        # Lower distance = more similar
        qs = (
            Product.objects.select_related("category")
            .filter(is_active=True, embedding__isnull=False)
            .annotate(distance=CosineDistance(F("embedding"), emb))
            .order_by("distance")[:20]
        )

        return Response({"q": q, "results": ProductSerializer(qs, many=True).data})

