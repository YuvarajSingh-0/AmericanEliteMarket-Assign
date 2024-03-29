import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const LoginSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model('Login', LoginSchema);
