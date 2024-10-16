from rest_framework import viewsets, status, serializers
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
from elasticsearch_dsl import Q
from .search_indexes import PostDocument, PremiumPostDocument
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.views import APIView
from openai import OpenAI
from django.conf import settings
import time
from django.core.cache import cache
from rest_framework.throttling import UserRateThrottle
from django.core.exceptions import ImproperlyConfigured


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


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = CustomUserDetailsSerializer


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


@api_view(["GET"])
def search_posts(request):
    query = request.GET.get("q", "")
    author = request.GET.get("author", "")

    if not query:
        return Response({"results": []})

    # Create a Q object for the search query
    search_query = Q(title__icontains=query) | Q(content__icontains=query)

    # If an author is specified, add it to the query
    if author:
        search_query &= Q(author__username=author)

    # Search regular posts
    regular_posts = Post.objects.filter(search_query)

    # Search premium posts if the user is authenticated and premium
    if request.user.is_authenticated and request.user.is_premium:
        premium_posts = PremiumPost.objects.filter(search_query)
    else:
        premium_posts = PremiumPost.objects.none()

    # Combine and serialize results
    regular_results = PostSerializer(regular_posts, many=True).data
    premium_results = PremiumPostSerializer(premium_posts, many=True).data

    combined_results = regular_results + premium_results

    # Sort combined results by created_at (assuming both models have this field)
    sorted_results = sorted(
        combined_results, key=lambda x: x["created_at"], reverse=True
    )

    return Response({"results": sorted_results})


class SummarizeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def post(self, request, format=None):
        content = request.data.get("content", "").strip()
        if not content:
            return Response(
                {"error": "Content is required for summarization."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cache_key = f"summary_{hash(content)}"
        cached_summary = cache.get(cache_key)
        if cached_summary:
            return Response({"summary": cached_summary}, status=status.HTTP_200_OK)

        max_retries = 3
        retry_delay = 1

        for attempt in range(max_retries):
            try:
                if not settings.OPENAI_API_KEY:
                    raise ImproperlyConfigured("OPENAI_API_KEY is not set in settings")

                client = OpenAI(api_key=settings.OPENAI_API_KEY)
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a helpful assistant that summarizes blog posts.",
                        },
                        {
                            "role": "user",
                            "content": f"Please summarize the following blog post:\n\n{content}",
                        },
                    ],
                    max_tokens=150,
                    temperature=0.5,
                )

                summary = response.choices[0].message.content.strip()
                cache.set(cache_key, summary, timeout=3600)  # Cache for 1 hour
                return Response({"summary": summary}, status=status.HTTP_200_OK)

            except ImproperlyConfigured as e:
                logger.error(f"OpenAI API key configuration error: {str(e)}")
                return Response(
                    {"error": "OpenAI API key is not properly configured."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
            except Exception as e:
                logger.error(f"OpenAI API error (attempt {attempt + 1}): {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                else:
                    return Response(
                        {
                            "error": "Unable to generate summary. Please try again later."
                        },
                        status=status.HTTP_503_SERVICE_UNAVAILABLE,
                    )
