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

def get_game(code):
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

def create_player(game_id, is_admin):
    with connection.cursor() as cursor:
        cursor.callproc('addPlayer', [game_id, is_admin])
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
    return

def make_suggestion(game_id, turn_id, player_id, suspect, weapon, room):
    with connection.cursor() as cursor:
        cursor.callproc('makeSuggestion', [game_id, turn_id, player_id, suspect, weapon, room])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Suggestion didn't work")
        
        status = result[0]
        player_id = result[1]
    return status == "True", player_id

def assume(game_id, player_id, suspect, weapon, room):
    with connection.cursor() as cursor:
        cursor.callproc('makeAssumption', [game_id, player_id, suspect, weapon, room])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Suggestion didn't work")
        
        status = result[0]
    return status

def shown_card(game_id, player_id, card):
    with connection.cursor() as cursor:
        cursor.callproc('showCard', [game_id, player_id, card])
        result = cursor.fetchone()
        if result is None:
            raise ValueError("Couldn't show card")
        
        status = result[0]
        suggested_player = result[1]
    return status, suggested_player

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
rooms = ["kitchen", "ballroom", "conservartory", "billiard-room", "library", "study", "hall", "lounge", "dining-room"]

def generate_clue():
    weapon = random.choice(murder_weapons)
    murderer = random.choice(murderers)
    room = random.choice(rooms)
    return weapon, murderer, room
