from rest_framework import serializers
from .models import Post, PremiumPost, Comment, PremiumComment
from django.contrib.auth import get_user_model
from dj_rest_auth.serializers import UserDetailsSerializer
import logging

logger = logging.getLogger(__name__)


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

    def to_internal_value(self, data):
        logger.info(f"Raw data received by serializer: {data}")
        return super().to_internal_value(data)

    def create(self, validated_data):
        print("Validated data:", validated_data)
        return super().create(validated_data)


class PremiumCommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")
    replies = serializers.SerializerMethodField()

    class Meta:
        model = PremiumComment
        fields = [
            "id",
            "post",
            "author",
            "text",
            "created_at",
            "updated_at",
            "parent",
            "replies",
        ]
        read_only_fields = ["id", "author", "created_at", "updated_at", "post"]

    def get_replies(self, obj):
        if obj.replies.exists():
            return PremiumCommentSerializer(obj.replies.all(), many=True).data
        return []
