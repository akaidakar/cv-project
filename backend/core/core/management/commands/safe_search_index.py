from django.core.management.base import BaseCommand
from django.core.management import call_command
from elasticsearch.exceptions import ConnectionError


class Command(BaseCommand):
    help = "Safely rebuild the search index"

    def handle(self, *args, **options):
        try:
            call_command("search_index", "--rebuild", "-f")
        except ConnectionError:
            self.stdout.write(
                self.style.WARNING(
                    "Elasticsearch is not available. Skipping index rebuild."
                )
            )
