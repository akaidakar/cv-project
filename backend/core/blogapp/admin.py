from django.contrib import admin
from .models import Post, PremiumPost


class PremiumPostAdmin(admin.ModelAdmin):
    list_display = ("blog_post", "created_at")
    fields = ("blog_post", "premium_content")


admin.site.register(Post)
admin.site.register(PremiumPost, PremiumPostAdmin)
