#!/bin/bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --noinput

if [[$CREATE_SUPERUSER]];
then
    python manage.py createsuperuser --no-input
fi

# Remove the following lines:
# python manage.py migrate
# python manage.py search_index --rebuild -f