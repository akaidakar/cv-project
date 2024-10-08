from rest_framework import viewsets, status
from rest_framework.permissions import (
    IsAdminUser,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from .models import Post, PremiumPost, Comment
from .permissions import IsAuthorOrReadOnly, IsPremium
from .serializers import (
    PostSerializer,
    UserSerializer,
    PremiumPostSerializer,
    CustomUserDetailsSerializer,
    CommentSerializer,
)  # Import the custom serializer
from django.contrib.auth import get_user_model
import logging
from rest_framework.response import Response
from rest_framework.decorators import action

logger = logging.getLogger(__name__)


class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = get_user_model().objects.all()
    serializer_class = CustomUserDetailsSerializer  # Use the custom serializer

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        logger.info(f"User retrieved: {user.username}, Is premium: {user.is_premium}")
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)


class PremiumPostViewSet(viewsets.ModelViewSet):
    queryset = PremiumPost.objects.all()
    serializer_class = PremiumPostSerializer
    permission_classes = [IsAuthenticated, IsPremium]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def list(self, request, *args, **kwargs):
        if not request.user.is_premium:
            return Response(
                {"detail": "Premium subscription required to access this content."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        if not request.user.is_premium:
            return Response(
                {"detail": "Premium subscription required to access this content."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().retrieve(request, *args, **kwargs)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id = self.kwargs.get("post_id")
        if post_id:
            return Comment.objects.filter(post_id=post_id)
        return Comment.objects.all()

    def create(self, request, *args, **kwargs):
        post_id = self.kwargs.get("post_id")
        logger.info(f"Attempting to create comment for post {post_id}")
        logger.info(f"Request data: {request.data}")

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            logger.error(f"Post with id {post_id} not found")
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, post=post)
            logger.info("Comment created successfully")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUIRED)
