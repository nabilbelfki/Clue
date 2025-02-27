import random
import string
from django.db import connection

def generate_random_code(): 
    return ''.join(random.choices(string.ascii_uppercase, k=4))

def create_game(code, suspect, weapon, room):
    with connection.cursor() as cursor:
        cursor.callproc('createGame', [code, suspect, weapon, room])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Stored procedure did not return any result")
        game_id = result[0]
    return game_id

def get_game_info(code):
    with connection.cursor() as cursor:
        cursor.callproc('getGame', [code])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Game not found")
        game_id = result[0]
    return game_id

def leave_game(game_id, player_id):
    with connection.cursor() as cursor:
        cursor.callproc('leftGame', [game_id, player_id])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Player not added")
        
        status = result[0]
        players = result[1]
    return status == "True", players

def is_admin(player_id):
    with connection.cursor() as cursor:
        cursor.callproc('isAdmin', [player_id])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Position Not Found")
        
        status = result[0]
    return status == "True"

def kick(game_id, player_id):
    with connection.cursor() as cursor:
        cursor.callproc('kickPlayer', [game_id, player_id])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Player not added")
        
        status = result[0]
        players = result[1]
    return status == "True", players

def ban(game_id, player_id):
    with connection.cursor() as cursor:
        cursor.callproc('banPlayer', [game_id, player_id])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Player not added")
        
        status = result[0]
        players = result[1]
    return status == "True", players

def create_player(game_id, ip_address, user_agent, is_admin):
    with connection.cursor() as cursor:
        cursor.callproc('addPlayerV2', [game_id, ip_address, user_agent, is_admin])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Player not added")
        player_id = result[0]
        player_name = result[1]
        players = result[2]
    return player_id, player_name, players

def show_players(game_id):
    with connection.cursor() as cursor:
        cursor.callproc('getPlayers', [game_id])
        result = cursor.fetchall()  # Fetch all rows returned by the procedure
        
        if not result:
            raise ValueError("No players found for this game.")
        
    return result

def rename_player(id, name):
    with connection.cursor() as cursor:
        cursor.callproc('renamePlayer', [id, name])
    return

def insert_card(player_id, slug, card_name, type):
    with connection.cursor() as cursor:
        cursor.callproc('addCard', [player_id, slug, card_name, type])
    return

def show_cards(player_id):
    with connection.cursor() as cursor:
        cursor.callproc('getCards', [player_id])
        result = cursor.fetchall()  # Fetch all rows returned by the procedure
        
        if not result:
            raise ValueError("No players found for this game.")
        
    return result

def select_player(player_id, game_id, character):
    with connection.cursor() as cursor:
        cursor.callproc('choosePlayer', [player_id, game_id, character])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Player not added")
        status = result[0]
        next_player = result[1]
    return status == "True", next_player

def insert_die(game_id, player_id, dice_roll):
    with connection.cursor() as cursor:
        cursor.callproc('rollDice', [game_id, player_id, dice_roll])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Player not added")
        
        status = result[0]
    return status == "True"

def get_position(game_id, player_id, turn_id):
    with connection.cursor() as cursor:
        cursor.callproc('getPosition', [game_id, player_id, turn_id])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Position Not Found")
        
        status = result[0]
        position = result[1]
    return status == "True", position

def get_turn(game_id):
    with connection.cursor() as cursor:
        cursor.callproc('getTurn', [game_id])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Player not added")
        
        turn = result[0]
    return turn

def insert_move(turn_id, position_id):
    with connection.cursor() as cursor:
        cursor.callproc('addMove', [turn_id, position_id])
    return

def change_turn(game_id):
    with connection.cursor() as cursor:
        cursor.callproc('changeTurn', [game_id])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Change Turn didn't work")
        new_turn_id = result[0]
        next_player = result[1]
    return new_turn_id, next_player

def make_suggestion(game_id, turn_id, player_id, suspect, weapon, room):
    with connection.cursor() as cursor:
        cursor.callproc('makeSuggestion', [game_id, turn_id, player_id, suspect, weapon, room])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Suggestion didn't work")
        
        status = result[0]
        player_id = result[1]
        last_suggestion = result[2]
    return status == "True", player_id, last_suggestion

def check_suggestion_id(suggestion_id):
    with connection.cursor() as cursor:
        cursor.callproc('checkSuggestion', [suggestion_id])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Suggestion check didn't work")
        
        status = result[0]
    return status == "True"

def assume(game_id, player_id, suspect, weapon, room):
    with connection.cursor() as cursor:
        cursor.callproc('makeAssumption', [game_id, player_id, suspect, weapon, room])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Suggestion didn't work")
        
        status = result[0]
        players_left = int(result[1])
    return status, players_left

def shown_card(game_id, player_id, card):
    with connection.cursor() as cursor:
        cursor.callproc('showCard', [game_id, player_id, card])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Couldn't show card")
        
        status = result[0]
        suggested_player = result[1]
    return status, suggested_player

def get_random_card_to_show(suggestion_id, player_id):
    with connection.cursor() as cursor:
        cursor.callproc('chooseRandomCardToShow', [suggestion_id, player_id])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Couldn't show card")
        
        status = result[0]
        card = result[1]
    return status == "True", card

def get_statistics(game_id):
    with connection.cursor() as cursor:
        cursor.callproc('getGameStatistics', [game_id])
        result = cursor.fetchall()  # Fetch all rows returned by the procedure
        
        if not result:
            raise ValueError("No players found for this game.")
        
    return result

def get_all_cards(game_id):
    with connection.cursor() as cursor:
        cursor.callproc('getAllPlayersCards', [game_id])
        result = cursor.fetchall()  # Fetch all rows returned by the procedure
        
        if not result:
            raise ValueError("No players found for this game.")
        
    return result

def get_murder(game_id):
    with connection.cursor() as cursor:
        cursor.callproc('getWinningCards', [game_id])
        result = cursor.fetchone()  # Fetch all rows returned by the procedure
        
        if not result:
            raise ValueError("No game found.")
        
        suspect = result[0]
        weapon = result[1]
        room = result[2]
    return suspect, weapon, room

def get_game_state(game_id, player_id):
    with connection.cursor() as cursor:
        cursor.callproc('getGameState', [game_id, player_id])
        result = cursor.fetchone()  # Fetch all rows returned by the procedure
        
        if not result:
            raise ValueError("No game found.")
        
        json = result[0]
    return json

def add_message(player_id, message):
    with connection.cursor() as cursor:
        cursor.callproc('addMessage', [player_id, message])
    return

colors = {
    "Chef White": "#FFFFFF"
    , "Mayor Green": "#618547"
    , "Solicitor Peacock": "#4C599D"
    , "Professor Plum": "#6C3C89"
    , "Miss Scarlett": "#872427"
    , "Colonel Mustard": "#C5A12F"
}

murder_weapons = ["candlestick", "knife", "lead-pipe", "revolver", "rope", "wrench"]
murderers = ["mrs-white", "mr-green", "mrs-peacock", "professor-plum", "miss-scarlet", "colonel-mustard"]
rooms = ["kitchen", "ballroom", "conservatory", "billiard-room", "library", "study", "hall", "lounge", "dining-room"]

def generate_clue():
    weapon = random.choice(murder_weapons)
    murderer = random.choice(murderers)
    room = random.choice(rooms)
    return weapon, murderer, room
