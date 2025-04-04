import json
import random
import traceback
import threading
import time
import uuid
from .board import board
#from .rooms import rooms
from .suggestions import suggestions
from django.shortcuts import render
from django.http import JsonResponse
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .utils import *

def home(request):
    return render(request, 'index.html')

def create_lobby(request):
    if request.method == 'POST':
        code = generate_random_code()
        weapon, murderer, room = generate_clue()
        game_id = create_game(code, murderer, weapon, room)
        request.session['game_id'] = game_id
        request.session['game_code'] = code
        request.session['suspect'] = murderer
        request.session['weapon'] = weapon
        request.session['room'] = room

        # Get the IP address
        ip_address = get_client_ip(request)

        # Get the User Agent
        user_agent = request.META.get('HTTP_USER_AGENT')

        player_id, player_name, players = create_player(game_id, ip_address, user_agent, "True")

        request.session['player_id'] = player_id
        request.session['player_name'] = player_name
        request.session['is_admin'] = True
        request.session['moves'] = 0

       # Send the message to the group using the helper function
        send_group_message(
            f'lobby_{code}',  # Group name
            'PlayerAdded',     # Action
            {'Players': json.loads(players)}
        )

        return JsonResponse({'game_id': game_id, 'game_code': code, 'player_id': player_id, 'player_name': player_name, 'players': players})

    return JsonResponse({'error': 'Invalid request method'}, status=400)


def join_lobby(request):
    if request.method == 'POST':
        code = request.POST.get('code')
        game_id = get_game_info(code)
        request.session['game_id'] = game_id
        request.session['game_code'] = code

        # Get the IP address
        ip_address = get_client_ip(request)

        # Get the User Agent
        user_agent = request.META.get('HTTP_USER_AGENT')

        player_id, player_name, players = create_player(game_id, ip_address, user_agent, "False")

        if player_id is None:
            return JsonResponse({'Status': False, 'Message': player_name})

        request.session['player_id'] = player_id
        request.session['player_name'] = player_name
        request.session['is_admin'] = False
        request.session['moves'] = 0

        # Send the message to the group using the helper function
        send_group_message(
            f'lobby_{code}',  # Group name
            'PlayerAdded',     # Action
            {'Players': json.loads(players)}
        )

        return JsonResponse({'Status': True, 'game_id': game_id, 'game_code': code, 'player_id': player_id, 'player_name': player_name, 'players': players})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def leave_lobby(request):
    if request.method == 'POST': 
        game_id = request.session.get('game_id')
        code = request.session.get('game_code')
        player_id = request.session.get('player_id')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)

        status, players = leave_game(game_id, player_id)

        if status:
            # Clear all session variables
            request.session.flush()

            # Check if players is not None before using json.loads
            if players is not None:
                # Send the message to the group using the helper function
                send_group_message(
                    f'lobby_{code}',  # Group name
                    'PlayerLeft',     # Action
                    {'Players': json.loads(players)}
                )

            return JsonResponse({'Status': True})
        else:         
            return JsonResponse({'Status': False, 'Reason': "Can't leave game has already started."})
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def kick_player(request):
    if request.method == 'POST': 
        game_id = request.session.get('game_id')
        code = request.session.get('game_code')
        player_id = request.POST.get('player_id')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)

        admin = is_admin(request.session.get('player_id'))
        
        if not admin:
            return JsonResponse({'Status': False, 'Reason': "You're not the admin."})

        status, players = kick(game_id, player_id)

        if status:

            # Send the message to the group using the helper function
            send_group_message(
                f'lobby_{code}',  # Group name
                'PlayerKicked', # Action
                {'PlayerID': player_id, 'Players': json.loads(players)}
            )

            return JsonResponse({'Status': True})
        else:         
            return JsonResponse({'Status': False, 'Reason': "Can't leave game has already started."})
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def ban_player(request):
    if request.method == 'POST': 
        game_id = request.session.get('game_id')
        code = request.session.get('game_code')
        player_id = request.POST.get('player_id')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        
        admin = is_admin(request.session.get('player_id'))
        
        if not admin:
            return JsonResponse({'Status': False, 'Reason': "You're not the admin."})

        status, players = ban(game_id, player_id)

        if status:

            # Send the message to the group using the helper function
            send_group_message(
                f'lobby_{code}',  # Group name
                'PlayerBanned', # Action
                {'PlayerID': player_id, 'Players': json.loads(players)}
            )

            return JsonResponse({'Status': True})
        else:         
            return JsonResponse({'Status': False, 'Reason': "Can't leave game has already started."})
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def flush_session(request):
    if request.method == 'POST': 
        # Clear all session variables
            request.session.flush()

def update_player(request):
    if request.method == 'POST':
        player_id = request.session.get('player_id') 
        code = request.session.get('game_code') 
        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        name = request.POST.get('name')
        rename_player(player_id, name)

        request.session['player_name'] = name

        # Send the message to the group using the helper function
        send_group_message(
            f'lobby_{code}',  # Group name
            'PlayerNameUpdated',     # Action
            {'ID': player_id, 'PlayerName': name}  # Body of the message
        )
        
        return JsonResponse({'ID': player_id,'Name': name})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def start_game(request):
    if request.method == 'POST':
        is_admin = request.session.get('is_admin')
        if is_admin: 
            game_id = request.session.get('game_id')
            admin_player_id = request.session.get('player_id')
            code = request.session.get('game_code') 
            
            # Define the list of cards
            cards = [
                ["miss-scarlet", "Miss Scarlet", "Suspect"],
                ["mrs-white", "Mrs. White", "Suspect"],
                ["colonel-mustard", "Colonel Mustard", "Suspect"],
                ["mrs-peacock", "Mrs. Peacock", "Suspect"],
                ["professor-plum", "Professor Plum", "Suspect"],
                ["mr-green", "Mr. Green", "Suspect"],
                ["wrench", "Wrench", "Weapon"],
                ["revolver", "Revolver", "Weapon"],
                ["lead-pipe", "Lead Pipe", "Weapon"],
                ["candlestick", "Candlestick", "Weapon"],
                ["rope", "Rope", "Weapon"],
                ["knife", "Knife", "Weapon"],
                ["ballroom", "Ballroom", "Room"],
                ["hall", "Hall", "Room"],
                ["conservatory", "Conservatory", "Room"],
                ["kitchen", "Kitchen", "Room"],
                ["billiard-room", "Billiard Room", "Room"],
                ["study", "Study", "Room"],
                ["library", "Library", "Room"],
                ["dining-room", "Dining Room", "Room"],
                ["lounge", "Lounge", "Room"]
            ]

            suspect = request.session.get('suspect')
            weapon = request.session.get('weapon') 
            room = request.session.get('room')
            
            # Filter out the cards that match the suspect, weapon, and room
            cards = [card for card in cards if card[0] not in [suspect, weapon, room]]

            # Shuffle the cards
            random.shuffle(cards)
            
            # Get the players for the game
            players = show_players(game_id)

            # Check if the count of players is greater than 1
            if len(players) < 2:
                return JsonResponse({'Status': "Can't start game with only one player"})
            
            # Convert players to a list of dictionaries (id, name)
            players_data = [{'id': player[0], 'order': player[3], 'name': player[4]} for player in players]

            # Get the list of player IDs
            player_ids = [player['id'] for player in players_data]  # Assuming player['id'] is player_id
            
            # Deal the cards to players in a round-robin fashion
            current_player_index = 0
            for card in cards:
                player_id = player_ids[current_player_index]
                card_slug, card_name, card_type = card

                if player_id == admin_player_id:
                    # Ensure that 'cards' exists in the session, if not, initialize it as an empty list
                    if 'cards' not in request.session:
                        request.session['cards'] = []
                    
                    # Append the new card to the 'cards' list in the session
                    request.session['cards'].append({"slug": card_slug, "name": card_name, "type": card_type})
                    
                    # Optionally, save the session to persist changes
                    request.session.modified = True
                
                # Insert the card into the database for the player
                insert_card(player_id, card_slug, card_name, card_type)
                
                # Move to the next player
                current_player_index = (current_player_index + 1) % len(player_ids)

            # Send the message to the group using the helper function
            send_group_message(
                f'lobby_{code}',  # Group name
                'GameStarted',     # Action
                {'Players': players_data}  # Body of the message
            )
            
            return JsonResponse({'Status': 'Game started and cards dealt'})
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)


def get_cards(request):
    if request.method == 'POST':
        player_id = request.session.get('player_id')
        if not player_id:
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        
        try:
            # Fetch cards for the player
            cards = show_cards(player_id)  

            # If the cards are returned as a list of tuples, convert them to a list of dictionaries
            cards_data = []
            for card in cards:
                card_data = {
                    'Slug': card[2],  # Assuming the first column is the slug
                    'Name': card[3],  # Assuming the second column is the card name
                    'Type': card[4]   # Assuming the third column is the card type
                }
                cards_data.append(card_data)

            # Initialize the 'cards' session variable if not already done
            if 'cards' not in request.session:
                request.session['cards'] = []

            # Append all the new cards to the session's 'cards' list
            request.session['cards'].extend(cards_data)

            # Return the cards as JSON
            return JsonResponse({'Cards': cards_data})
        
        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def choose_player(request):
    if request.method == 'POST':
        player_name = request.session.get('player_name') 
        player_id = request.session.get('player_id')
        game_id = request.session.get('game_id')
        code = request.session.get('game_code') 
        character = request.POST.get('slug')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        
        status, next_player = select_player(player_id, game_id, character)
        
        if status:

            # Send the message to the group using the helper function
            send_group_message(
                f'lobby_{code}',  # Group name
                'PlayerChosen',     # Action
                {'ID': player_id, 'Name': player_name, 'Slug': character, 'Next': next_player}
            )

            if next_player is None:
                current_turn_id = get_turn(game_id)
                threading.Thread(target=check_turn_and_send_message, args=(game_id, current_turn_id, code)).start()
        else:         
            return JsonResponse({'Status': False})
        
        return JsonResponse({'Status': True})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def roll_dice(request):
    if request.method == 'POST': 
        game_id = request.session.get('game_id')
        code = request.session.get('game_code') 
        player_id = request.session.get('player_id')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        
        # Generate random dice rolls
        die1 = random.randint(1, 6)
        die2 = random.randint(1, 6)
        dice_roll = die1 + die2

        request.session['moves'] = dice_roll
        
        # Insert the dice roll into the database or perform any necessary actions
        status = insert_die(game_id, player_id, dice_roll)

        if status:
            # Send the message to the group using the helper function
            send_group_message(
                f'lobby_{code}',  # Group name
                'DiceRoll', # Action
                {'ID': player_id,'Dice': {"First": die1, "Second":die2}}
            )
            
            return JsonResponse({'Status': True, 'DiceRoll': dice_roll})
        else:         
            return JsonResponse({'Status': False})
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def move(request):
    if request.method == 'POST': 
        game_id = request.session.get('game_id')
        code = request.session.get('game_code') 
        player_id = request.session.get('player_id')
        moves = request.session.get('moves')
        direction = request.POST.get('direction')

        if moves == 0:
            return JsonResponse({'Status': False, 'Reason': 'No Moves'})

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)

        turn_id = get_turn(game_id)

        status, position = get_position(game_id, player_id, turn_id)

        if status:
            if position.isdigit(): 
                position = int(position)

            if direction in board[position]:
                insert_move(turn_id, board[position][direction])

                moves -= 1

                rooms = {
                    "study": True,
                    "lounge": True,
                    "library": True,
                    "kitchen": True,
                    "dining-room": True,
                    "assumption": True,
                    "conservatory": True,
                    "billiard-room": True,
                    "ballroom": True,
                    "hall": True
                }

                request.session['moves'] = moves
                if moves == 0 and board[position][direction] not in rooms:
                    current_turn_id, next_player = change_turn(game_id)

                # Send the message to the group using the helper function
                send_group_message(
                    f'lobby_{code}',  # Group name
                    'Move', # Action
                    {'ID': player_id, 'Position': board[position][direction], 'Moves': moves}
                )

                if moves == 0 and board[position][direction] not in rooms:
                    threading.Thread(target=check_turn_and_send_message, args=(game_id, current_turn_id, code)).start()
                
                return JsonResponse({'Status': True})
        else:         
            return JsonResponse({'Status': False, 'Reason': 'Not Your Turn'})

    return JsonResponse({'error': 'Invalid request method'}, status=400)

def suggest(request):
    if request.method == 'POST': 
        game_id = request.session.get('game_id')
        code = request.session.get('game_code')
        player_id = request.session.get('player_id')

        suspect = request.POST.get('suspect')
        weapon = request.POST.get('weapon')
        room = request.POST.get('room')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        
        turn_id = get_turn(game_id)

        status, player_to_show_card, suggestion_id = make_suggestion(game_id, turn_id, player_id, suspect, weapon, room)

        if status:
            current_turn_id, next_player = change_turn(game_id)

            # Send the message to the group using the helper function
            send_group_message(
                f'lobby_{code}',  # Group name
                'Suggestion',     # Action
                {'ID': player_id, 'Suspect': suggestions[suspect], 'Weapon': suggestions[weapon], 'Room': suggestions[room], 'Shower': player_to_show_card}
            )

            # Start a new thread to handle the timer
            if is_int_string(player_to_show_card):
                threading.Thread(target=check_card_show_and_send_message, args=(game_id, player_to_show_card, suggestion_id, code)).start()
            else:
                threading.Thread(target=check_turn_and_send_message, args=(game_id, current_turn_id, code)).start()
        
            return JsonResponse({'Status': True})
        else:         
            return JsonResponse({'Status': False, 'Reason': 'Not Your Turn'})
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def assumption(request):
    if request.method == 'POST': 
        game_id = request.session.get('game_id')
        code = request.session.get('game_code')
        player_id = request.session.get('player_id')

        suspect = request.POST.get('suspect')
        weapon = request.POST.get('weapon')
        room = request.POST.get('room')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        
        result, players_left = assume(game_id, player_id, suspect, weapon, room)

        if result == "Not Turn":
            return JsonResponse({'Status': False, 'Reason': 'Not Your Turn'})

        current_turn_id, next_player = change_turn(game_id)

        response =  {'ID': player_id, 'Suspect': suggestions[suspect], 'Weapon': suggestions[weapon], 'Room': suggestions[room], 'Correct': result == "True", "PlayersLeft": players_left}

        if result == "True":
            game_statistics = get_statistics(game_id)
            players_cards = get_all_cards(game_id)
            response["Statistics"] = game_statistics
            response["Cards"] = players_cards

        if players_left == 1:
            game_statistics = get_statistics(game_id)
            players_cards = get_all_cards(game_id)
            response["Statistics"] = game_statistics
            response["Cards"] = players_cards
            winning_suspect, winning_weapon, winning_room = get_murder(game_id)
            response["WinningSuspect"] = winning_suspect
            response["WinningWeapon"] = winning_weapon
            response["WinningRoom"] = winning_room
        
        # Send the message to the group using the helper function
        send_group_message(
            f'lobby_{code}',  # Group name
            'Assumption', # Action
            response
        )
        
        threading.Thread(target=check_turn_and_send_message, args=(game_id, current_turn_id, code)).start()
        
        return JsonResponse({'Status': True, 'Correct': result})
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def show_card(request):
    if request.method == 'POST': 
        game_id = request.session.get('game_id')
        code = request.session.get('game_code')
        player_id = request.session.get('player_id')

        card = request.POST.get('card')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        
        status, suggested_player = shown_card(game_id, player_id, card)
        if status == "Not Suggested":
            return JsonResponse({'Status': False, 'Reason': "That's not one of the suggested cards"})
        if status == "Not Turn":
            return JsonResponse({'Status': False, 'Reason': 'Not your turn'})
        if status == "No Show":
            return JsonResponse({'Status': False, 'Reason': 'No one can show a card'})
        if status == "Already Shown":
            return JsonResponse({'Status': False, 'Reason': 'Card has already been shown'})

        # Send the message to the group using the helper function
        send_group_message(
            f'lobby_{code}',  # Group name
            'CardShown', # Action
            {'ID': player_id, 'SuggestedPlayer': suggested_player, 'Card': card}
        )

        current_turn_id = get_turn(game_id)

        threading.Thread(target=check_turn_and_send_message, args=(game_id, current_turn_id, code)).start()

        return JsonResponse({'Status': True})
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def next_turn(request):
    if request.method == 'POST': 
        game_id = request.session.get('game_id')
        code = request.session.get('game_code')
        player_id = request.session.get('player_id')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        
        
        current_turn_id, next_player = change_turn(game_id)

        # Send the message to the group using the helper function
        send_group_message(
            f'lobby_{code}',  # Group name
            'TurnEnded', # Action
            {'ID': player_id}
        )
        
        threading.Thread(target=check_turn_and_send_message, args=(game_id, current_turn_id, code)).start()
        
        return JsonResponse({'Status': True})
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def player_message(request):
    if request.method == 'POST': 
        code = request.session.get('game_code')
        player_id = request.session.get('player_id')
        message = request.POST.get('message')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        
        add_message(player_id, message)

        # Send the message to the group using the helper function
        send_group_message(
            f'lobby_{code}',  # Group name
            'Message', # Action
            {'Player': player_id, 'Message': message}
        )
        
        return JsonResponse({'Status': True})
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def get_game(request):
    if request.method == 'GET': 
        game_id = request.session.get('game_id')
        player_id = request.session.get('player_id')

        if not player_id: 
            return JsonResponse({'error': 'Player ID not found in session'}, status=400)
        
        game = get_game_state(game_id, player_id)
        
        return JsonResponse({'Game': json.loads(game)})
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

# Helper function to send a message to a WebSocket group
def send_group_message(group_name, action, body):
    try:
        # Log the message being sent
        print(f"Attempting to send message to group: {group_name}")
        
        # Get the channel layer
        channel_layer = get_channel_layer()

        # Check if the channel layer is correctly initialized
        if not channel_layer:
            raise ValueError("Channel layer is not initialized correctly.")
        
        # Prepare the message data
        message_data = {
            'type': 'lobby_message',
            'message': {
                'Action': action,
                'Body': body
            }
        }

        # Send the message to the group
        async_to_sync(channel_layer.group_send)(
            group_name,  # Group name
            message_data  # Message data
        )

        # Log that the message has been sent successfully
        print(f"Message sent to group: {group_name} - Message: {message_data['message']}")

    except Exception as e:
        # Log detailed error if something goes wrong
        print(f"Error sending message to group: {group_name}")
        print(f"Exception type: {type(e).__name__}")
        print(f"Exception message: {str(e)}")
        # Optionally log the stack trace
        traceback.print_exc()

def check_turn_and_send_message(game_id, current_turn_id, code):
    while True:
        # Wait for 2 minutes and 5 seconds (125 seconds)
        time.sleep(125)

        new_turn_id = get_turn(game_id)
        
        # Check if the new turn ID is different from the current turn ID
        if new_turn_id != current_turn_id:
            break
        
        current_turn_id, next_player = change_turn(game_id)

        # Send the message to the group using the helper function
        send_group_message(
            f'lobby_{code}',  # Group name
            'TurnEnded',      # Action
            {'ID': next_player} # Message content
        )

def check_card_show_and_send_message(game_id, player_id, suggestion_id, code):
        # Wait for 2 minutes and 5 seconds (125 seconds)
        time.sleep(65)

        was_card_shown = check_suggestion_id(suggestion_id)
        
        # Check if the new turn ID is different from the current turn ID
        if not was_card_shown:
        
            status, card = get_random_card_to_show(suggestion_id, player_id)

            if status:

                status, suggested_player = shown_card(game_id, player_id, card)
                
                if status == "Not Suggested":
                    return
                if status == "Not Turn":
                    return
                if status == "No Show":
                    return
                if status == "Already Shown":
                    return
                
                # Send the message to the group using the helper function
                send_group_message(
                    f'lobby_{code}',  # Group name
                    'CardShown', # Action
                    {'ID': player_id, 'SuggestedPlayer': suggested_player, 'Card': card}
                )
            
                current_turn_id = get_turn(game_id)

                threading.Thread(target=check_turn_and_send_message, args=(game_id, current_turn_id, code)).start()

def is_int_string(value):
    try:
        int(value)
        return True
    except ValueError:
        return False
    
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip