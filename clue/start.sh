#!/bin/bash
source venv/bin/activate
redis-server
python manage.py migrate
python manage.py runserver 0.0.0.0:8000 &
daphne -b 0.0.0.0 -p 8001 clue.asgi:application