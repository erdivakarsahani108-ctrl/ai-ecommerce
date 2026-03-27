from __future__ import annotations

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from search.embeddings import embed_text

from .models import Product


@receiver(post_save, sender=Product)
def update_product_embedding(sender, instance: Product, created: bool, **kwargs):
    # Keep embeddings fresh for semantic search.
    text = f"{instance.name}\n\n{instance.description}\n\nCategory: {instance.category.name}"
    try:
        result = embed_text(text)
    except Exception:
        # If embeddings provider is misconfigured, we don't want to break writes.
        return

    Product.objects.filter(pk=instance.pk).update(
        embedding=result.vector,
        embedding_updated_at=timezone.now(),
    )

