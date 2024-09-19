from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.author == request.user


from rest_framework import permissions


class IsPremium(permissions.BasePermission):
    """
    Custom permission to only allow users with a 'premium' subscription to access certain views.
    """

    def has_permission(self, request, view):
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return False

        # Check if the user has a 'premium' subscription
        return getattr(request.user, "subscription", None) == "premium"
