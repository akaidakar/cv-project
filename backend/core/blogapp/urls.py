from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import UserViewSet, PostViewSet, PremiumPostViewSet, CommentViewSet

router = SimpleRouter()
router.register("users", UserViewSet, basename="users")
router.register("posts", PostViewSet, basename="posts")
router.register("premium", PremiumPostViewSet, basename="premium_posts")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "posts/<int:post_id>/comments/",
        CommentViewSet.as_view({"get": "list", "post": "create"}),
        name="post-comments",
    ),
]
