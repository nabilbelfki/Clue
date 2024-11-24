from django.db import models
import random
import string

def generate_lobby_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))

class Lobby(models.Model):
    code = models.CharField(max_length=4, default=generate_lobby_code, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Player(models.Model):
    name = models.CharField(max_length=100)
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE)
