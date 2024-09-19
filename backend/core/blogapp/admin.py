from django.contrib import admin
from .models import Post, PremiumPost

# Register your models here.

admin.site.register(Post)
admin.site.register(PremiumPost)
