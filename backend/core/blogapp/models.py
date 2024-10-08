from django.db import models
from django.conf import settings
from django.utils import timezone
from .permissions import IsAuthorOrReadOnly
from django.contrib.auth import get_user_model

# Create your models here.
User = get_user_model()


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


class Comment(models.Model):
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE, related_name="replies"
    )

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"
