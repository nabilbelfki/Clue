# Use the official Ubuntu base image
FROM ubuntu:latest

# Set environment variables to avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install necessary packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    redis-server \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    vim

# Set the working directory
WORKDIR /app

# Clone the repository (replace <your-repo-url> with your actual repository URL)
RUN git clone https://github.com/nabilbelfki/Clue.git clue

# Set the working directory to the nested clue directory
WORKDIR /app/clue/clue

# Install Python dependencies
RUN python3 -m venv venv
RUN /bin/bash -c "source venv/bin/activate && pip install --upgrade pip && pip install daphne django channels mysqlclient"

# Collect static files during build
RUN /bin/bash -c "source venv/bin/activate && python manage.py collectstatic --noinput"

# Expose the ports that Django and Daphne will run on
EXPOSE 8000 8001

# Start Redis server
RUN service redis-server start

# Run the application
CMD /bin/bash -c "source venv/bin/activate && python manage.py migrate && python manage.py runserver 0.0.0.0:8000 & source venv/bin/activate && daphne -b 0.0.0.0 -p 8001 clue.asgi:application"
