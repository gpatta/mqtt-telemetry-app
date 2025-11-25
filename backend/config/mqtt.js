import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const WEBSOCKET = false;
const WEBSOCKET_PORT = 8080;
const MQTT_PORT = 8883;

// MQTT connection options
const options = {
    host: process.env.MQTT_BROKER_HOST,     // Broker URL
    port: WEBSOCKET ? WEBSOCKET_PORT : MQTT_PORT,                 // Broker port
    protocol: WEBSOCKET ? 'ws' : 'mqtts',          // Protocol for secure connection
    username: 'gpatta',
    password: 'password',
    // ca: fs.readFileSync('./certs/ca.pem'),           // CA certificate
    // cert: fs.readFileSync('./certs/client.pem'),     // Client certificate
    // key: fs.readFileSync('./certs/client-key.pem'),  // Client private key
    // rejectUnauthorized: true,   // Ensure broker's certificate is valid
    
    // clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    // clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
}

const topic = 'esc/#';

export function connectMqttBroker() {
    const client = mqtt.connect(options);

    // Handle events
    client.on('connect', () => {
        console.log('Connected to MQTT broker: ', options.host);
        // Example subscription and publishing after connection
        client.subscribe(topic, (err) => {
            if (err) {
                console.error('Failed to subscribe to topic: ', err);
            } else {
                console.log('Subscribed to topic: ', topic);
            }
        });
        // client.publish('test/topic', 'Hello MQTT');
    });

    // client.on('message', async (topic, payload) => {
    //     console.log(`Received message on topic ${topic}: ${payload}`);
    // });

    client.on('error', (err) => {
        console.error('MQTT Error:', err);
    });

    return client;
}