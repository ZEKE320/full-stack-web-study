from django.forms import ValidationError
from rest_framework import status


class BusinessException(ValidationError):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
