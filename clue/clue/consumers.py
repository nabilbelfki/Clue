import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

class LobbyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_code = self.scope['url_route']['kwargs']['game_code']
        self.lobby_group_name = f'lobby_{self.game_code}'

        print(f"Joining group {self.lobby_group_name}...")

        # Join the group
        await self.channel_layer.group_add(
            self.lobby_group_name,
            self.channel_name
        )

        await self.accept()

        # Start the session timeout
        self.session_task = asyncio.create_task(self.session_timeout())

    async def lobby_message(self, event):
        print(f"Received message: {event['message']}")
        await self.send(text_data=json.dumps(event['message']))

    async def disconnect(self, close_code):
        print(f"Disconnecting from group {self.lobby_group_name}...")
        await self.channel_layer.group_discard(
            self.lobby_group_name,
            self.channel_name
        )

        # Cancel the session timeout task if it's still running
        if hasattr(self, 'session_task'):
            self.session_task.cancel()

    async def session_timeout(self):
        try:
            # Wait for 1 hour (3600 seconds)
            await asyncio.sleep(3600)
            # Close the WebSocket connection after the timeout
            await self.close()
        except asyncio.CancelledError:
            # Handle the cancellation if the task is cancelled
            pass
