from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Post, PremiumPost
from .permissions import IsAuthorOrReadOnly, IsPremium
from .serializers import PostSerializer, UserSerializer, PremiumPostSerializer

# Create your views here.


class PostViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthorOrReadOnly,)
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class PremiumPostViewSet(viewsets.ModelViewSet):
    permission_classes = [IsPremium]
    queryset = PremiumPost.objects.all()
    serializer_class = PremiumPostSerializer
