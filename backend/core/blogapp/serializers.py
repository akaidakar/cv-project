from rest_framework import serializers
from .models import Post, PremiumPost
from django.contrib.auth import get_user_model
from dj_rest_auth.serializers import UserDetailsSerializer


class PostSerializer(serializers.ModelSerializer):
    # user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        fields = (
            "id",
            "author",
            "title",
            "body",
            "created_at",
        )
        model = Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "username",
        )


class PremiumPostSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="blog_post.title", read_only=True)
    body = serializers.CharField(source="blog_post.body", read_only=True)
    author = serializers.CharField(source="blog_post.author.username", read_only=True)

    class Meta:
        model = PremiumPost
        fields = [
            "id",
            "title",
            "body",
            "premium_content",
            "author",
            "created_at",
        ]


class CustomUserDetailsSerializer(UserDetailsSerializer):
    is_premium = serializers.BooleanField(read_only=True)
    subscription = serializers.CharField(read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ("subscription", "is_premium")
