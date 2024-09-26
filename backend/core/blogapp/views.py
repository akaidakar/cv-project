from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
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

logger = logging.getLogger(__name__)


class PostViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthorOrReadOnly,)
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = get_user_model().objects.all()
    serializer_class = CustomUserDetailsSerializer  # Use the custom serializer

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        logger.info(f"User retrieved: {user.username}, Is premium: {user.is_premium}")
        serializer = self.get_serializer(user)
        return Response(serializer.data)


class PremiumPostViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsPremium]
    queryset = PremiumPost.objects.all()
    serializer_class = PremiumPostSerializer
