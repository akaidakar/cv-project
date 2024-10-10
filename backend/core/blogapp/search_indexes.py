from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import Post, PremiumPost


@registry.register_document
class PostDocument(Document):
    author = fields.ObjectField(
        properties={
            "username": fields.TextField(),
        }
    )

    class Index:
        name = "posts"
        settings = {"number_of_shards": 1, "number_of_replicas": 0}

    class Django:
        model = Post
        fields = [
            "id",
            "title",
            "content",
            "created_at",
            "updated_at",
        ]


@registry.register_document
class PremiumPostDocument(Document):
    author = fields.ObjectField(
        properties={
            "username": fields.TextField(),
        }
    )

    class Index:
        name = "premium_posts"
        settings = {"number_of_shards": 1, "number_of_replicas": 0}

    class Django:
        model = PremiumPost
        fields = [
            "id",
            "title",
            "content",
            "created_at",
            "updated_at",
        ]
