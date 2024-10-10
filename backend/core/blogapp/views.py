from rest_framework import viewsets, status
from rest_framework.permissions import (
    IsAdminUser,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from .models import Post, PremiumPost, Comment, PremiumComment
from .permissions import IsAuthorOrReadOnly, IsPremium
from .serializers import (
    PostSerializer,
    UserSerializer,
    PremiumPostSerializer,
    CustomUserDetailsSerializer,
    CommentSerializer,
    PremiumCommentSerializer,
)  # Import the custom serializer
from django.contrib.auth import get_user_model
import logging
from rest_framework.response import Response
from rest_framework.decorators import action
import json
from rest_framework.parsers import JSONParser

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
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs.get("post_id")
        return Comment.objects.filter(post_id=post_id, parent=None)

    def perform_create(self, serializer):
        post_id = self.kwargs.get("post_id")
        parent_id = self.request.data.get("parent")
        try:
            post = Post.objects.get(id=post_id)
            parent = Comment.objects.get(id=parent_id) if parent_id else None
            serializer.save(author=self.request.user, post=post, parent=parent)
        except Post.DoesNotExist:
            raise serializers.ValidationError(f"Post with id {post_id} does not exist")
        except Comment.DoesNotExist:
            raise serializers.ValidationError(
                f"Parent comment with id {parent_id} does not exist"
            )

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required to post comments."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def reply(self, request, pk=None, post_id=None):
        parent_comment = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, post_id=post_id, parent=parent_comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PremiumCommentViewSet(viewsets.ModelViewSet):
    queryset = PremiumComment.objects.all()
    serializer_class = PremiumCommentSerializer
    permission_classes = [IsAuthenticated, IsPremium]

    def get_queryset(self):
        return PremiumComment.objects.filter(post_id=self.kwargs.get("post_id"))

    def perform_create(self, serializer):
        post = PremiumPost.objects.get(id=self.kwargs.get("post_id"))
        serializer.save(author=self.request.user, post=post)

    def create(self, request, *args, **kwargs):
        post_id = self.kwargs.get("post_id")
        parent_id = request.data.get("parent")

        try:
            post = PremiumPost.objects.get(id=post_id)
        except PremiumPost.DoesNotExist:
            return Response(
                {"error": "Premium Post not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, post=post, parent_id=parent_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
