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

#echo "Attempting to create superuser..."
#if [ -z "$DJANGO_SUPERUSER_USERNAME" ] || [ -z "$DJANGO_SUPERUSER_EMAIL" ] || [ -z "$DJANGO_SUPERUSER_PASSWORD" ]; then
    #echo "Error: DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, or DJANGO_SUPERUSER_PASSWORD environment variable is not set." | tee -a superuser.log
#else
    #python manage.py createsuperuser --noinput 2>&1 | tee superuser.log
    #if [ $? -eq 0 ]; then
        #echo "Superuser created successfully." | tee -a superuser.log
    #else
        #echo "Failed to create superuser. Check the logs for more details." | tee -a superuser.log
    #fi
#fi
echo "Superuser creation attempt completed."

echo "Build process completed."

# Print out all logs for debugging
echo "=== PIP INSTALL LOG ==="
cat pip_install.log
echo "=== COLLECTSTATIC LOG ==="
cat collectstatic.log
echo "=== MIGRATIONS LOG ==="
cat migrations.log
echo "=== SUPERUSER CREATION LOG ==="
cat superuser.log
