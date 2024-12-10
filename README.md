# Clue
An interactive online approach to the classic game of Clue.

## Prerequisites
Before you begin, ensure you have the following installed on your system:

Python 3.10 or higher
pip (Python package installer)
Redis server

# Installation
Follow these steps to set up the Clue project:

## 1. Install Redis
Install Redis on your system. For example, on Ubuntu, you can use:

```bash
sudo apt update
sudo apt install redis-server
```

## 2. Clone the Repository
Navigate to the directory where you want to clone the project and run:

```bash
git clone https://github.com/yourusername/clue.git
cd clue
```

## 3. Install Python Dependencies
Install the required Python packages using pip:

```bash
pip install -r requirements.txt
```
## 4. Start Redis Server
Start the Redis server:
```bash
redis-server
```
## 5. Apply Database Migrations
Run the following command to apply database migrations:
```bash
python manage.py migrate
```
## 6. Collect Static Files
Collect static files for the project:
```bash
python manage.py collectstatic --clear --noinput
```
## 7. Start the Django Development Server
Start the Django development server:
```bash
python manage.py runserver 0.0.0.0:8000 &
```
## 8. Start Daphne Server
Start the Daphne server to handle WebSocket connections:
```bash
daphne -b 0.0.0.0 -p 8001 clue.asgi:application
```
# Accessing the Application
Open your web browser and navigate to `http://your_domain_or_ip:8000` to access the Clue application.

# Troubleshooting
If you encounter any issues, ensure that:

Redis server is running and accessible.
All dependencies are installed correctly.
Ports 8000 and 8001 are open and not blocked by any firewall.
Feel free to reach out if you need further assistance!

# Play the Game
I have the game hosted on a server, if you want to access it and play it you can go to this website:

`https://clue.nabilbelfki.com/`
