from rest_framework import serializers

from api.inventory.models import Product, Purchase, Sale


class InventorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    unit = serializers.IntegerField()
    quantity = serializers.IntegerField()
    type = serializers.IntegerField()
    date = serializers.DateTimeField()


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = "__all__"


class SalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = "__all__"
