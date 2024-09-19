from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import UserViewSet, PostViewSet, PremiumPostViewSet

router = SimpleRouter()
router.register("users", UserViewSet, basename="users")
router.register("", PostViewSet, basename="posts")
router.register("premium", PremiumPostViewSet, basename="premium_posts")
urlpatterns = router.urls
