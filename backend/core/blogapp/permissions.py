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
        return obj.author == request.user


class IsPremium(permissions.BasePermission):
    def has_permission(self, request, view):
        is_premium = getattr(request.user, "subscription", None) == "premium"
        logger.info(f"IsPremium check for user {request.user.username}: {is_premium}")
        return request.user.is_authenticated and is_premium
