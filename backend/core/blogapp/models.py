from django.db import models
from django.conf import settings
from django.utils import timezone
from .permissions import IsAuthorOrReadOnly

# Create your models here.


class Post(models.Model):
    title = models.CharField(max_length=200)  # Increased to 200
    content = models.TextField()  # Changed from 'body' to 'content'
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class PremiumPost(models.Model):
    title = models.CharField(max_length=200, default="Untitled Premium Post")
    content = models.TextField(default="")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,  # Change this to SET_NULL
        related_name="premium_posts",
        null=True,  # Keep this as nullable for now
        blank=True,  # Allow blank in forms
    )
    created_at = models.DateTimeField(default=timezone.now)  # Add this line
    updated_at = models.DateTimeField(default=timezone.now)  # Changed this line

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        return super(PremiumPost, self).save(*args, **kwargs)
