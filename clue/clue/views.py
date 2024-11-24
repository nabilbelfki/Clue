from django.shortcuts import render
from django.http import JsonResponse
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .utils import create_game, generate_random_code, get_game, create_player, generate_clue, rename_player

def create_lobby(request):
    if request.method == 'POST':
        code = generate_random_code()
        weapon, murderer, room = generate_clue()
        game_id = create_game(code, murderer, weapon, room)
        request.session['game_id'] = game_id
        request.session['game_code'] = code
        player_id, player_name, players = create_player(game_id, "True")
        request.session['player_id'] = player_id
        request.session['player_name'] = player_name

        # Send WebSocket message
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'lobby_{code}',
            {
                'type': 'lobby_message',
                'message': {
                    'action': 'PlayerAdded',
                    'players': players
                }
            }
        )

        return JsonResponse({'game_id': game_id, 'game_code': code, 'player_id': player_id, 'player_name': player_name, 'players': players})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def join_lobby(request):
    if request.method == 'POST':
        code = request.POST.get('code')
        game_id = get_game(code)
        request.session['game_id'] = game_id
        request.session['game_code'] = code
        player_id, player_name, players = create_player(game_id, "False")
        request.session['player_id'] = player_id
        request.session['player_name'] = player_name

        # Send WebSocket message
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'lobby_{code}',
            {
                'type': 'lobby_message',
                'message': {
                    'action': 'PlayerAdded',
                    'players': players
                }
            }
        )

        return JsonResponse({'game_id': game_id, 'game_code': code, 'player_id': player_id, 'player_name': player_name, 'players': players})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def home(request):
    return render(request, 'index.html')

def update_player(request):
    if request.method == 'POST':
        player_id = request.session.get('player_id') 
        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        name = request.POST.get('name')
        rename_player(player_id, name)
        return JsonResponse({'ID': player_id,'Name': name})
    return JsonResponse({'error': 'Invalid request method'}, status=400)