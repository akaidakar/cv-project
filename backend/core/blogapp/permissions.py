from rest_framework import permissions
import logging

logger = logging.getLogger(__name__)


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        is_author = obj.author == request.user
        logger.info(
            f"IsAuthorOrReadOnly check: User {request.user.username} (ID: {request.user.id}), Post author {obj.author.username} (ID: {obj.author.id}), Is author: {is_author}"
        )
        return is_author


class IsPremium(permissions.BasePermission):
    def has_permission(self, request, view):
        is_premium = getattr(request.user, "subscription", None) == "premium"
        logger.info(f"IsPremium check for user {request.user.username}: {is_premium}")
        return request.user.is_authenticated and is_premium
