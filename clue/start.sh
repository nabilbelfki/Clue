#!/bin/bash
# Start Redis
redis-server --save "" &

# Activate virtual environment
source /app/Clue/clue/venv/bin/activate

# Navigate to Django project directory
cd /app/Clue/clue

# Apply migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Start Django development server
python manage.py runserver 0.0.0.0:8000 &

# Start Daphne for ASGI
daphne -b 0.0.0.0 -p 8001 clue.asgi:application
