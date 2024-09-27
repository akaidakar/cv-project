from rest_framework import serializers
from .models import Post, PremiumPost
from django.contrib.auth import get_user_model
from dj_rest_auth.serializers import UserDetailsSerializer


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "content",
            "author",
            "created_at",
            "updated_at",
        ]  # Changed 'body' to 'content'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "username",
        )


class PremiumPostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = PremiumPost
        fields = [
            "id",
            "title",
            "content",
            "author",
            "created_at",
            "updated_at",
        ]


class CustomUserDetailsSerializer(UserDetailsSerializer):
    is_premium = serializers.BooleanField(read_only=True)
    subscription = serializers.CharField(read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ("subscription", "is_premium")
