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

def rename_player(id, name):
    with connection.cursor() as cursor:
        cursor.callproc('renamePlayer', [id, name])
    return

colors = {
    "Chef White": "#FFFFFF"
    , "Mayor Green": "#618547"
    , "Solicitor Peacock": "#4C599D"
    , "Professor Plum": "#6C3C89"
    , "Miss Scarlett": "#872427"
    , "Colonel Mustard": "#C5A12F"
}

murder_weapons = ["Candlestick", "Knife", "Lead Pipe", "Revolver", "Rope", "Wrench"]
murderers = ["Chef White", "Mayor Green", "Solicitor Peacock", "Professor Plum", "Miss Scarlett", "Colonel Mustard"]
rooms = ["Kitchen", "Ballroom", "Conservartory", "Billiard Room", "Library", "Study", "Hall", "Lounge", "Dining Room"]

def generate_clue():
    weapon = random.choice(murder_weapons)
    murderer = random.choice(murderers)
    room = random.choice(rooms)
    return weapon, murderer, room
