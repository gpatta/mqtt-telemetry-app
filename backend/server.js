import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import router from './auth/auth.js';
import Message from './model/Message.js';
import User from './model/User.js';
import { connectMqttBroker } from './config/mqtt.js';
import DefaultData from './model/DefaultData.js';

dotenv.config(); // Load environment variables

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', router);
const PORT = process.env.PORT || 5000;

try {
    await connectDB();
    console.log('MongoDB connected successfully');

} catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
}

const updateInterval = 1000; // ms
let buffers = {};
let updates = false;


const saveBuffersToDB = async () => {

    if (updates) {
        let startDt = new Date();
        console.log(`Starting saving messages to MongoDB: dt: ${startDt}`);

        for (const owner in buffers) { 
            if (buffers[owner] && buffers[owner].length > 0) {
                
                // Insert the data into the database one message at a time
                // for (const message in buffers[owner]) {
                //     // Create a new message and insert into database
                //     try {
                //         let savingDt = new Date();
    
                //         const newData = await DefaultData.create({
                //             "owner": buffers[owner][message].owner,
                //             "device_id": buffers[owner][message].device_id,
                //             "payload": buffers[owner][message].payload,
                //             "saving_dt": savingDt,
                //             "received_dt": buffers[owner][message].received_dt
                //         });

                //         // console.log('Message saved to MongoDB: ', newData);
                //     } catch (err) {
                //         console.error('Error saving message: ', err);
                //     }
                // }

                // Insert the data into the database in bulk
                try {
                    await DefaultData.insertMany(buffers[owner]);
                    console.log(`Messages of owner ${owner} saved to MongoDB: took ${(new Date()) - startDt} ms`);
                } catch (error) {
                    console.error(`Error saving data for owner ${owner}: ${error}`);
                }
    
                // console.log(`Data for ${owner} is being saved to the database`);
                buffers[owner] = [];
            }
        }

        updates = false;
    }
};

// Set up a timer to save buffers to the database
setInterval(saveBuffersToDB, updateInterval);
console.log("Interval set for saving data to the database");

// TODO: keep the latest data for each device in the server

// API to get the latest data for all devices
app.get('/api/new', async (req, res) => {

    let startDt = new Date();
    // console.log(`Received request on API /api/new from user X`);

    // TODO: verify the identity and permissions of the user

    try {
        // take the data from the db, group by device_id and take the latest data for each device
        const result = await DefaultData.aggregate([
            { $sort: { 
                device_id: 1,
                received_dt: 1
            } },
            { $group: {
                _id: "$device_id",
                data: { $first: "$$ROOT" }
            } },
            { $project: {
                _id: 0,
                owner: "$data.owner",
                device_id: "$data.device_id",
                payload: "$data.payload"
            }},
            // Sort the final result by device_id to ensure consistent ordering
            { $sort: { device_id: 1 } }
        ]);
        console.log(`Response for API /api/new sent to user: took ${(new Date()) - startDt} ms`);
        res.json(result);
    } catch (err) {
        console.log(`/api/new error: ${err}`);
        res.status(500).json({ error: 'Server error: failed to fetch data from the database' });
    }
});

// API to get the latest data for devices of a specific owner
app.get('/api/new/:owner', async (req, res) => {
    // TODO: verify the identity and permissions of the user

    // take the data from the db, filter by owner, group by device_id and take the latest data for each device

    // return the data in the response
});

// API to get the data for a specific device
app.get('/api/all/:device_id', async (req, res) => {

    let limit = 300;

    let startDt = new Date();
    // console.log(`Received request on API /api/all/:device_id from user X`);

    // TODO: verify the identity and permissions of the user

    const { device_id } = req.params;

    // TODO: verify the parameters

    // take the data from the db, filter by device_id
    try {
        // Query the database for all data for this device_id
        const data = await DefaultData.find({ device_id: device_id }).sort({ received_dt: 1 }).limit(limit);
    
        // Send the response
        res.json(data);
        console.log(`Response for API /api/all/${device_id} sent to user: took ${(new Date()) - startDt} ms`);
    } catch (error) {
        console.error(`Error fetching data for device_id ${device_id}:`, error);
        res.status(500).send('Server Error: Failed to fetch data for device');
    }
});

// TODO: remove this API
// API to get all messages
app.get('/api/messages', async (req, res) => {
    try {
      const messages = await Message.find();
      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
});


// Start the express server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
