from django.db import transaction
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from cart.models import Cart, CartItem

from .models import Order, OrderItem
from .serializers import CheckoutSerializer, OrderSerializer


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items__product__category")

    @action(detail=False, methods=["post"], url_path="checkout")
    @transaction.atomic
    def checkout(self, request):
        checkout = CheckoutSerializer(data=request.data)
        checkout.is_valid(raise_exception=True)

        try:
            cart = Cart.objects.select_for_update().get(user=request.user)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = (
            CartItem.objects.select_related("product", "product__category")
            .select_for_update()
            .filter(cart=cart)
        )
        if not cart_items.exists():
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        subtotal = 0
        for item in cart_items:
            subtotal += item.product.price_cents * item.quantity
        shipping = 0
        total = subtotal + shipping

        order = Order.objects.create(
            user=request.user,
            subtotal_cents=subtotal,
            shipping_cents=shipping,
            total_cents=total,
            **checkout.validated_data,
        )
        for item in cart_items:
            unit = item.product.price_cents
            line = unit * item.quantity
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                unit_price_cents=unit,
                line_total_cents=line,
            )

        cart_items.delete()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

