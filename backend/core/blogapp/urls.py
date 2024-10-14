from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    AuthorViewSet,
    PostViewSet,
    PremiumPostViewSet,
    CommentViewSet,
    PremiumCommentViewSet,
    search_posts,
    SummarizeAPIView,
)

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("authors", AuthorViewSet, basename="authors")
router.register("posts", PostViewSet, basename="posts")
router.register("premium", PremiumPostViewSet, basename="premium_posts")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "posts/<int:post_id>/comments/",
        CommentViewSet.as_view({"get": "list", "post": "create"}),
        name="post-comments",
    ),
    path(
        "premium/<int:post_id>/comments/",
        PremiumCommentViewSet.as_view({"get": "list", "post": "create"}),
        name="premium-comments",
    ),
    path("search/", search_posts, name="search_posts"),
    path("ai/summarize/", SummarizeAPIView.as_view(), name="summarize"),
]
