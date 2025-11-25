import paho.mqtt.client as mqtt
import ssl
import json
from datetime import datetime, timezone
import signal
import sys
import pytz
import time


# Configuration
SENDING_PERIOD = 1      # Frequency of sending data in seconds
CLIENT_NUMBER = 10      # Number of clients


# Function to handle termination signals
def handle_exit_signal(signum, frame):
    print(f"Signal {signum} received, stopping...")
    mqtt_client.loop_stop()  # Stop the loop if using loop_start()
    mqtt_client.disconnect()  # Disconnect from the broker
    raise SystemExit(0)  # Raise SystemExit to avoid exit code 1

# Register the signal handlers for SIGINT and SIGTERM
signal.signal(signal.SIGINT, handle_exit_signal)  # Handle Ctrl+C or VS Code stop
signal.signal(signal.SIGTERM, handle_exit_signal)  # Handle termination signals

# MQTT broker configuration
mqtt_websocket = False
mqtt_tls = False
# broker_address = "test.mosquitto.org"   # https://test.mosquitto.org/
broker_address = "localhost"
port = 8080 if mqtt_websocket else 8883 if mqtt_tls else 1883
topic = "gpatta/"
project = "gpa"
username = "gpatta"
password = "password"

# SSL/TLS settings
ca_cert = "../cloud/ca.pem"  # Path to CA certificate
client_cert = "../cloud/client.pem"  # Path to client certificate
client_key = "../cloud/client-key.pem"  # Path to client private key

# Define the data
owners = [
    {
        "owner_id": 10003,
        "name": "Company A",
        "nickname": "a",
        "devices": [
            {
                "device_id": 10001+i,
                "name": f"Prototype_{i+1}"
            } for i in range(CLIENT_NUMBER)
        ]
    }
]

data = {
    "id": 10001,        # Device ID
	"dt": datetime.now(timezone.utc).isoformat(),
    "bt": {             # Battery data
	    "v": 500.0,     # Battery voltage
        "c": 0.0,       # Battery current
        "t": 25.0,      # Battery temperature
        "s": 100.0,     # Battery state of charge
        "a": 0.0        # Battery anomaly
    },
    "mt": {},           # Motor data
    "mc": {},           # Motor controller data
}

payload = json.dumps(data)
# print(payload)
# print("Data length:    ", len(payload.encode('utf-8')), " bytes")
# print("Payload length: ", 1 + 1 + 2 + 10 + 2 + len(payload.encode('utf-8')), " bytes")


# # Callback function for connection
# def on_connect(mqtt_client, userdata, flags, rc):
#     if rc == 0:
#         print("Connected successfully!")
#         mqtt_client.subscribe(topic)
#     else:
#         print(f"Connection failed with code {rc}")

# # Callback function for receiving messages
# def on_message(mqtt_client, userdata, message):
#     print(f"Received message on {message.topic}: {message.payload.decode()}")


# Create a new MQTT client instance
mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, transport="websockets") if mqtt_websocket else mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

# Configure TLS
if mqtt_tls:
    mqtt_client.tls_set(ca_certs=ca_cert,
                   certfile=client_cert,
                   keyfile=client_key,
                   cert_reqs=ssl.CERT_REQUIRED,
                   tls_version=ssl.PROTOCOL_TLS,
                   ciphers=None)

# Set the username and password for the MQTT client
mqtt_client.username_pw_set(username, password)

# # Attach callbacks
# mqtt_client.on_connect = on_connect
# mqtt_client.on_message = on_message

# Connect to the broker
try:
    mqtt_client.connect(broker_address, port=port)
    print("Connected to broker: " + broker_address)
except Exception as e:
    print(f"Connection failed: {e}")
    exit(1)

# Publish a message to the specified topic
# hello_payload = json.dumps("Hello, World!")
# try:
#     mqtt_client.publish(topic, hello_payload)
#     print(f"Published hello payload")
# except Exception as e:
#     print(f"Publish of hello payload failed: {e}")
#     exit(1)

# for client in owners:
#     for edge in client["devices"]:
#         data = {
#             "id": edge["device_id"],
#             "dt": datetime.now(timezone.utc).isoformat(),
#             "bt": {
#                 "v": 510.0,
#                 "c": 0.0,
#                 "t": 25.0,
#                 "s": 100.0,
#                 "a": 0.0
#             },
#             "mt": {},
#             "mc": {}
#         }
#         payload = json.dumps(data)
#         data_topic = f"{project}/{client['nickname']}/dt"
#         try:
#             mqtt_client.publish(data_topic, payload)
#             print("Published data in topic ", data_topic, "for edge ", edge["name"])
#         except Exception as e:
#             print(f"Publish failed: {e}")
#             exit(1)

# MQTT loop
mqtt_client.loop_start()

try:
    print("MQTT client loop. Press CTRL+C to stop.")
    while True:
        print("Publishing data: datetime ", datetime.now(timezone.utc).isoformat())
        for client in owners:
            for edge in client["devices"]:
                data = {
                    "id": edge["device_id"],
                    "dt": datetime.now(timezone.utc).isoformat(),
                    "bt": {
                        "v": 500.0,
                        "c": 0.0,
                        "t": 25.0,
                        "s": 100.0,
                        "a": 0.0
                    },
                    "mt": {},
                    "mc": {}
                }
                payload = json.dumps(data)
                data_topic = f"{project}/{client['nickname']}/dt"
                try:
                    mqtt_client.publish(data_topic, payload)
                    # print("Published data in topic ", data_topic, "for edge ", edge["name"])
                except Exception as e:
                    print(f"Publish failed: {e}")
                    exit(1)
        time.sleep(SENDING_PERIOD)

except KeyboardInterrupt:
    handle_exit_signal(signal.SIGINT, None)
except SystemExit:
    pass
except Exception as e:
    print(f"Unexpected error: {e}")
    exit(1)

print("Disconnected from broker: " + broker_address)



# print(f"Message '{message}' sent to topic '{topic}'")

# try:
#     counter = 0
#     while True:
#         # Create a message with the counter value
#         message = f"Counter: {counter}"
        
#         # Publish the message to the specified topic
#         client.publish(topic, message)
        
#         # Print the message for confirmation
#         print(f"Published: {message}")
        
#         # Increment the counter
#         counter += 1
        
#         # Wait for 1 second before publishing the next message
#         time.sleep(1)

# except KeyboardInterrupt:
#     # Disconnect from the broker when the script is interrupted
#     client.disconnect()
#     print("Disconnected from broker")