from django.conf import settings
from django.db.models import F, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework.request import Request

from api.inventory.exception import BusinessException
from api.inventory.models import Product, Purchase, Sales
from api.inventory.serializers import (
    InventorySerializer,
    ProductSerializer,
    PurchaseSerializer,
    SalesSerializer,
)


# Create your views here.
class LoginView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = []

    def post(self, request: Request) -> Response:
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        access = serializer.validated_data.get("access", None)
        refresh = serializer.validated_data.get("refresh", None)
        if access:
            response = Response(status=status.HTTP_200_OK)
            max_age = settings.COOKIE_TIME
            response.set_cookie("access", access, httponly=True, max_age=max_age)
            response.set_cookie("refresh", refresh, httponly=True, max_age=max_age)
            return response
        return Response(
            {"errMsg": "ユーザーの認証に失敗しました。"}, status=status.HTTP_401_UNAUTHORIZED
        )


class RetryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = []

    def post(self, request: Request) -> Response:
        refresh = request.COOKIES.get("refresh")
        request.data["refresh"] = refresh
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        access = serializer.validated_data.get("access", None)
        if access:
            response = Response(status=status.HTTP_200_OK)
            max_age = settings.COOKIE_TIME
            response.set_cookie("access", access, httponly=True, max_age=max_age)
            response.set_cookie("refresh", refresh, httponly=True, max_age=max_age)
            return response
        return Response(
            {"errMsg": "ユーザーの認証に失敗しました。"}, status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request: Request, *args):
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response


class InventoryView(APIView):
    def get(self, request: Request, id=None, format=None) -> Response:
        if id is None:
            return Response(status.HTTP_400_BAD_REQUEST)

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
            Sale.objects.filter(product_id=id)
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
    def get_object(self, pk) -> Product:
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise NotFound

    def get(self, request: Request, id=None, format=None) -> Response:
        if id is None:
            queryset = Product.objects.all()
            serializer = ProductSerializer(queryset, many=True)
        else:
            product = self.get_object(id)
            serializer = ProductSerializer(product)
        return Response(serializer.data, status.HTTP_200_OK)

    def post(self, request: Request, format=None):
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

    def put(self, request: Request, id, format=None) -> Response:
        product = self.get_object(id)
        serializer = ProductSerializer(instance=product, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)

    def delete(self, request: Request, id, format=None) -> Response:
        product = self.get_object(id)
        product.delete()
        return Response(status=status.HTTP_200_OK)


class PurchaseView(APIView):
    def post(self, request: Request, format=None) -> Response:
        serializer = PurchaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)


class SalesView(APIView):
    def post(self, request: Request, format=None) -> Response:
        serializer = SalesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)
