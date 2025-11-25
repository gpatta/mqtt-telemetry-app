import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema, 'users');

export default User;