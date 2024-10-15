#!/bin/bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --noinput

# Always attempt to create the superuser
python manage.py create_superuser

# Remove the following lines:
# python manage.py migrate
# python manage.py search_index --rebuild -f