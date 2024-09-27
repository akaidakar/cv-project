from django.contrib import admin
from .models import Post, PremiumPost


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
