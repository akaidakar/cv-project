from rest_framework import viewsets, status
from rest_framework.permissions import (
    IsAdminUser,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from .models import Post, PremiumPost
from .permissions import IsAuthorOrReadOnly, IsPremium
from .serializers import (
    PostSerializer,
    UserSerializer,
    PremiumPostSerializer,
    CustomUserDetailsSerializer,
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
