from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/lobby/<str:game_code>/', consumers.LobbyConsumer.as_asgi()),
]
