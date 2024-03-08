import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    content: String,
    timestamp: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        ref: 'User'
    }
});

export default mongoose.model('Post', PostSchema);
