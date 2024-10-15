#!/bin/bash
set -o errexit

echo "Starting build process..."

pip install -r requirements.txt
echo "Dependencies installed."

python manage.py collectstatic --noinput
echo "Static files collected."

echo "Attempting to run migrations..."
python manage.py migrate
echo "Migrations completed."

echo "Attempting to create superuser..."
python manage.py create_superuser
echo "Superuser creation attempt completed."

echo "Build process completed."