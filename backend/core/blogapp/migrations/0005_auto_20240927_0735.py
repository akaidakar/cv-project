from django.db import migrations
from django.conf import settings


def set_default_author(apps, schema_editor):
    PremiumPost = apps.get_model("blogapp", "PremiumPost")
    User = apps.get_model(settings.AUTH_USER_MODEL)
    default_user = User.objects.first()  # or some other way to get a default user
    if default_user:
        PremiumPost.objects.filter(author__isnull=True).update(author=default_user)


class Migration(migrations.Migration):

    dependencies = [
        (
            "blogapp",
            "0004_rename_body_post_content_and_more",
        ),  # replace with the actual previous migration
    ]

    operations = [
        migrations.RunPython(set_default_author),
    ]
