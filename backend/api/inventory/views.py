from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from api.inventory.models import Product, Purchase, Sales
from api.inventory.serializers import (
    InventorySerializer,
    ProductSerializer,
    PurchaseSerializer,
    SalesSerializer,
)

from api.inventory.exception import BusinessException


# Create your views here.
class InventoryView(APIView):
    def get(self, request, id=None, format=None):
        if id is None:
            return Response(status.HTTP_400_BAD_REQUEST)
        else:
            purchase = (
                Purchase.objects.filter(product_id=id)
                .prefetch_related("product")
                .values(
                    "id",
                    "quantity",
                    type=Value("1"),
                    date=F("purchase_date"),
                    unit=F("product__price"),
                )
            )
            sales = (
                Sales.objects.filter(product_id=id)
                .prefetch_related("product")
                .values(
                    "id",
                    "quantity",
                    type=Value("2"),
                    date=F("sales_date"),
                    unit=F("product__price"),
                )
            )
            queryset = purchase.union(sales).order_by(F("date"))
            serializer = InventorySerializer(queryset, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


class ProductView(APIView):
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise NotFound

    def get(self, request, id=None, format=None):
        if id is None:
            queryset = Product.objects.all()
            serializer = ProductSerializer(queryset, many=True)
        else:
            product = self.get_object(id)
            serializer = ProductSerializer(product)
        return Response(serializer.data, status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        purchase = Purchase.objects.filter(
            product_id=request.data["product"]
        ).aggregate(quantity_sum=Coalesce(Sum("quantity"), 0))
        sales = Sales.objects.filter(product_id=request.data["product"]).aggregate(
            quantity_sum=Coalesce(Sum("quantity"), 0)
        )

        if purchase["quantity_sum"] < (
            sales["quantity_sum"] + int(request.data["quantity"])
        ):
            raise BusinessException("在庫数量を超過することはできません。")

        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

    def put(self, request, id, format=None):
        product = self.get_object(id)
        serializer = ProductSerializer(instance=product, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)

    def delete(self, request, id, format=None):
        product = self.get_object(id)
        product.delete()
        return Response(status=status.HTTP_200_OK)


class PurchaseView(APIView):
    def post(self, request, format=None):
        serializer = PurchaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)


class SalesView(APIView):
    def post(self, request, format=None):
        serializer = SalesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)
