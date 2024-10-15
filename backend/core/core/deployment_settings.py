import os
import dj_database_url
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = [os.environ["RENDER_EXTERNAL_HOSTNAME"]]
CSRF_TRUSTED_ORIGINS = ["https://" + os.environ["RENDER_EXTERNAL_HOSTNAME"]]

DEBUG = False
SECRET_KEY = os.environ["SECRET_KEY"]


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]


# CORS_ALLOWED_ORIGINS = [
# ]


STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}


DATABASES = {
    "default": dj_database_url.config(
        default=os.environ["DATABASE_URL"],
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Elasticsearch configuration
ELASTICSEARCH_DSL = {
    "default": {"hosts": os.environ.get("ELASTICSEARCH_URL", "http://localhost:9200")},
}

CORS_ALLOWED_ORIGINS = [
    "https://cv-project-1.onrender.com",
    "https://cv-project-wfk4.onrender.com",  # Add your frontend URL
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "https://cv-project-1.onrender.com",
    "https://cv-project-wfk4.onrender.com",  # Add your frontend URL
]
