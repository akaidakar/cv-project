from django.contrib import admin
from .models import Post, PremiumPost, Comment


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "created_at", "updated_at")
    list_filter = ("author", "created_at")
    search_fields = ("title", "content")
    date_hierarchy = "created_at"


@admin.register(PremiumPost)
class PremiumPostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "created_at", "updated_at")
    list_filter = ("author", "created_at")
    search_fields = ("title", "content")
    date_hierarchy = "created_at"


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["id", "author", "post", "created_at"]
    list_filter = ["author", "created_at"]
    search_fields = ["text", "author__username", "post__title"]
    date_hierarchy = "created_at"
    readonly_fields = ["created_at", "updated_at"]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("author", "post")
