import mongoose from "mongoose";

const defaultDataSchema = new mongoose.Schema({
    owner: String,
    device_id: String,
    payload: Object,
    received_dt: Date,
    saving_dt: { type: Date, default: Date.now },
    saved_dt: { type: Date, default: Date.now }
});

const DefaultData = mongoose.model('DataObject', defaultDataSchema, 'data');

export default DefaultData