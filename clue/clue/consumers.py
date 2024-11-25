import json
from channels.generic.websocket import AsyncWebsocketConsumer

class LobbyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_code = self.scope['url_route']['kwargs']['game_code']
        self.lobby_group_name = f'lobby_{self.game_code}'

        print(f"Joining group {self.lobby_group_name}...")  # Make sure this log appears when connecting

        # Join the group
        await self.channel_layer.group_add(
            self.lobby_group_name,  # Make sure this group name matches the one used in `group_send`
            self.channel_name
        )

        await self.accept()

    async def lobby_message(self, event):
        print(f"Received message: {event['message']}")  # Log the message received by the consumer
        await self.send(text_data=json.dumps(event['message']))

    async def disconnect(self, close_code):
        print(f"Disconnecting from group {self.lobby_group_name}...")
        await self.channel_layer.group_discard(
            self.lobby_group_name,
            self.channel_name
        )
