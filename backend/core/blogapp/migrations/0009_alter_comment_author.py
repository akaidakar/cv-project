from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


def set_default_author(apps, schema_editor):
    Comment = apps.get_model("blogapp", "Comment")
    User = apps.get_model(settings.AUTH_USER_MODEL)
    default_user = User.objects.first()
    if default_user:
        Comment.objects.filter(author__isnull=True).update(author=default_user)
    else:
        raise Exception(
            "No users found in the database. Please create a user before running this migration."
        )


class Migration(migrations.Migration):

    dependencies = [
        ("blogapp", "0001_initial"),  # Make sure this matches your previous migration
    ]

    operations = [
        migrations.RunPython(set_default_author),
        migrations.AlterField(
            model_name="comment",
            name="author",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
