from rest_framework import serializers

from catalog.serializers import ProductSerializer

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "unit_price_cents", "line_total_cents"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "subtotal_cents",
            "shipping_cents",
            "total_cents",
            "shipping_name",
            "shipping_address1",
            "shipping_address2",
            "shipping_city",
            "shipping_state",
            "shipping_postal_code",
            "shipping_country",
            "items",
            "created_at",
            "updated_at",
        ]


class CheckoutSerializer(serializers.Serializer):
    shipping_name = serializers.CharField(max_length=200)
    shipping_address1 = serializers.CharField(max_length=200)
    shipping_address2 = serializers.CharField(max_length=200, required=False, allow_blank=True)
    shipping_city = serializers.CharField(max_length=120)
    shipping_state = serializers.CharField(max_length=120, required=False, allow_blank=True)
    shipping_postal_code = serializers.CharField(max_length=30)
    shipping_country = serializers.CharField(max_length=2, default="US")

