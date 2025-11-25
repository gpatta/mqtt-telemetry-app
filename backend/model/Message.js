import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    topic: String,
    payload: Object,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema, 'data');

export default Message;