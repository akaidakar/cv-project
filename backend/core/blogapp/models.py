from django.db import models
from django.conf import settings
from .permissions import IsAuthorOrReadOnly

# Create your models here.


class Post(models.Model):
    title = models.CharField(max_length=50)
    body = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class PremiumPost(models.Model):
    # fmt: off
    blog_post = models.OneToOneField(Post, on_delete=models.CASCADE, default=None)  # PremiumPost is linked to BlogPost
    premium_content = models.TextField()  # Additional content for premium users
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
