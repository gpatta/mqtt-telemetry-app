# MQTT Telemetry App

This project aims to build a custom Cloud Infrastructure to gather edge data (MQTT), process it, and present it through a ReactJS Web App.

## Project Structure

## Setup

Dependencies:
- Update the system
- Install Docker

Run:

```bash
echo "MONGO_PASSWORD=$(openssl rand -hex 16)" >> .env
docker compose build --no-cache
docker compose up -d
docker ps -a
```
