import random

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

# Example usage
weapon, murderer, room = generate_clue()
print(f"The murder was committed by {murderer} in the {room} with a {weapon}.")
