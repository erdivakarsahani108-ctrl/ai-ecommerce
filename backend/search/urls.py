from django.urls import path

from .views import SemanticSearchView


urlpatterns = [
    path("semantic/", SemanticSearchView.as_view(), name="semantic_search"),
]

