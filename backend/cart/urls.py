from django.urls import path

from .views import AddItemView, CartView, RemoveItemView, UpdateItemView


urlpatterns = [
    path("", CartView.as_view(), name="cart"),
    path("items/add/", AddItemView.as_view(), name="cart_add_item"),
    path("items/<int:item_id>/", UpdateItemView.as_view(), name="cart_update_item"),
    path("items/<int:item_id>/remove/", RemoveItemView.as_view(), name="cart_remove_item"),
]

