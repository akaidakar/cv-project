#!/bin/bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --noinput

# Remove the following lines:
# python manage.py migrate
# python manage.py search_index --rebuild -f