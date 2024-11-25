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
    redis-server

# Set the working directory
WORKDIR /app

# Clone the repository (replace <your-repo-url> with your actual repository URL)
RUN git clone https://github.com/nabilbelfki/Clue.git .

# Install Python dependencies
RUN python3 -m venv venv
RUN . venv/bin/activate && pip install --upgrade pip && pip install daphne
# RUN . venv/bin/activate && pip install -r requirements.txt  # Uncomment this line when you have requirements.txt

# Copy the start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose the ports that Django and Daphne will run on
EXPOSE 8000 8001

# Start Redis server
RUN service redis-server start

# Command to run the application
CMD ["/app/start.sh"]
