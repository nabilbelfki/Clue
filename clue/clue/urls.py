# clue/clue/urls.py
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('game/create/', views.create_lobby, name='create_lobby'),
    path('game/join/', views.join_lobby, name='join_lobby'),
    path('player/', views.update_player, name='update_player'),
    path('player/choose/', views.choose_player, name='choose_player'),
    path('game/start/', views.start_game, name='start_game'),
    path('cards/get/', views.get_cards, name='get_cards'),
    path('roll/', views.roll_dice, name='roll_dice'),
    path('move/', views.move, name='move'),
    path('suggest/', views.suggest, name='suggest'),
]
