from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os


class Command(BaseCommand):
    help = "Creates a superuser with environment variables"

    def handle(self, *args, **options):
        User = get_user_model()
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        self.stdout.write(f"Attempting to create superuser: {username}")

        if not username or not email or not password:
            self.stdout.write(
                self.style.ERROR("Missing required environment variables")
            )
            return

        try:
            user, created = User.objects.get_or_create(username=username, email=email)
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.save()

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Superuser {username} created successfully")
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f"Superuser {username} updated successfully")
                )

            self.stdout.write(
                f"User details: username={user.username}, email={user.email}, is_staff={user.is_staff}, is_superuser={user.is_superuser}"
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Failed to create/update superuser: {str(e)}")
            )

        # Verify superuser
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            self.stdout.write(
                f"Final check - User exists: {user.username}, Is staff: {user.is_staff}, Is superuser: {user.is_superuser}"
            )
        else:
            self.stdout.write(
                self.style.ERROR(
                    f"Final check - User {username} does not exist after creation attempt"
                )
            )
