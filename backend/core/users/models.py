from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
import logging

logger = logging.getLogger(__name__)

# Create your models here.
only_letters = RegexValidator(r"^[a-zA-Z]*$", "Only letters are allowed.")
FREE = "free"
PREMIUM = "premium"
SUBSCRIPTION_CHOICES = [
    (FREE, "Free"),
    (PREMIUM, "Premium"),
]


class CustomUser(AbstractUser):
    username = models.CharField(max_length=64, unique=True)
    first_name = models.CharField(
        max_length=255, blank=False, null=False, validators=[only_letters]
    )
    last_name = models.CharField(
        max_length=255, blank=False, null=False, validators=[only_letters]
    )
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    subscription = models.CharField(
        max_length=10, choices=SUBSCRIPTION_CHOICES, default=FREE
    )

    @property
    def is_premium(self):
        return self.subscription == PREMIUM

    def __str__(self):
        return self.username

    def upgrade_to_premium(self):
        self.subscription = PREMIUM  # Use the module-level constant
        self.save()
        return self.subscription
