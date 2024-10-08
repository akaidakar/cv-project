from rest_framework import serializers
from .models import Post, PremiumPost, Comment
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


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")
    post = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "post", "author", "text", "created_at", "updated_at", "parent"]
        read_only_fields = ["id", "author", "created_at", "updated_at", "post"]

    def create(self, validated_data):
        print("Validated data:", validated_data)
        return super().create(validated_data)
