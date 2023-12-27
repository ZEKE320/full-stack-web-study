from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication

HEADER_TYPE = "Bearer"


class CustomJWTAuthentication(JWTAuthentication):
    def get_header(self, request: Request):
        token = request.COOKIES.get("access")
        request.META["HTTP_AUTHORIZATION"] = f"{HEADER_TYPE} {token}"
        return super().get_header(request)
