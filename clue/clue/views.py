from django.shortcuts import render
from .utils import generate_clue

def home(request):
    weapon, murderer, room = generate_clue()
    context = {
        'weapon': weapon,
        'murderer': murderer,
        'room': room,
    }
    return render(request, 'index.html', context)
