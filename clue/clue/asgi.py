# clue/clue/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from clue import routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "clue.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Handle HTTP traffic with Django
    "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns  # Handle WebSocket traffic with Django Channels
        )
    ),
})
