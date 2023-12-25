from django.urls import path

from api.inventory import views


urlpatterns = [
    path("products/", views.ProductView.as_view()),
    path("products/<int:id>/", views.ProductView.as_view()),
    path("inventories/<int:id>/", views.InventoryView.as_view()),
    path("purchase/", views.PurchaseView.as_view()),
    path("sales/", views.SalesView.as_view()),
]
