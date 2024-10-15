set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --noinput

python manage.py migrate

python manage.py search_index --rebuild -f