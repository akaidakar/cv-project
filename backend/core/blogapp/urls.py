from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import UserViewSet, PostViewSet, PremiumPostViewSet

router = SimpleRouter()
router.register("users", UserViewSet, basename="users")
router.register("posts", PostViewSet, basename="posts")
router.register("premium", PremiumPostViewSet, basename="premium_posts")

urlpatterns = [
    path("", include(router.urls)),
]
