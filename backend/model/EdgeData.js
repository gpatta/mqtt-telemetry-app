import mongoose from "mongoose";

const {Schema, model} = mongoose;

const edgeDataSchema = new Schema({
    device_id: Number,
    datetime: Date,
    battery: {
        "battery_voltage": Number,
        "battery_current": Number,
        "battery_temperature": Number,
        "battery_soc": Number,
        "battery_anomaly": Number
    },
    motors: String
});

const EdgeData = model('EdgeData', edgeDataSchema);

export default EdgeData;