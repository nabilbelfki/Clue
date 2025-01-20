# clue/clue/urls.py
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('game/', views.get_game, name='get_game'),
    path('game/create/', views.create_lobby, name='create_lobby'),
    path('game/join/', views.join_lobby, name='join_lobby'),
    path('player/', views.update_player, name='update_player'),
    path('player/choose/', views.choose_player, name='choose_player'),
    path('game/start/', views.start_game, name='start_game'),
    path('game/next/', views.next_turn, name='next_turn'),
    path('game/leave/', views.leave_lobby, name='leave_lobby'),
    path('player/kick/', views.kick_player, name='kick_player'),
    path('player/ban/', views.ban_player, name='ban_player'),
    path('cards/get/', views.get_cards, name='get_cards'),
    path('cards/show/', views.show_card, name='show_card'),
    path('roll/', views.roll_dice, name='roll_dice'),
    path('move/', views.move, name='move'),
    path('suggest/', views.suggest, name='suggest'),
    path('assume/', views.assumption, name='assumption'),
    path('message/', views.player_message, name='player_message'),
    path('session/flush/', views.flush_session, name='flush_session')
]
