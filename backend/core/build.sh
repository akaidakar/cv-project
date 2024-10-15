#!/bin/bash
set -o pipefail  # This will make the script exit on error, but still capture output

echo "Starting build process..."

pip install -r requirements.txt 2>&1 | tee pip_install.log
echo "Dependencies installed."

python manage.py collectstatic --noinput 2>&1 | tee collectstatic.log
echo "Static files collected."

echo "Attempting to run migrations..."
python manage.py migrate 2>&1 | tee migrations.log
echo "Migrations completed."

echo "Build process completed."

# Print out all logs for debugging
echo "=== PIP INSTALL LOG ==="
cat pip_install.log
echo "=== COLLECTSTATIC LOG ==="
cat collectstatic.log
echo "=== MIGRATIONS LOG ==="
cat migrations.log
