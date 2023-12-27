from django.db import models


# Create your models here.
class Product(models.Model):
    name: models.CharField = models.CharField(max_length=100, verbose_name="商品名")
    price: models.IntegerField = models.IntegerField(verbose_name="価格")
    description: models.TextField = models.TextField(
        verbose_name="商品説明", null=True, blank=True
    )

    class Meta:
        db_table = "product"
        verbose_name = "商品"


class Purchase(models.Model):
    product: models.ForeignKey = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity: models.IntegerField = models.IntegerField(verbose_name="数量")
    purchase_date: models.DateTimeField = models.DateTimeField(verbose_name="仕入日時")

    class Meta:
        db_table = "purchase"
        verbose_name = "仕入"


class Sale(models.Model):
    product: models.ForeignKey = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity: models.IntegerField = models.IntegerField(verbose_name="数量")
    sales_date: models.DateTimeField = models.DateTimeField(verbose_name="売上日時")

    class Meta:
        db_table = "sales"
        verbose_name = "売上"
