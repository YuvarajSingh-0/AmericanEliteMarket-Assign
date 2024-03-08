import mongoose from 'mongoose';

const FollowSchema = new mongoose.Schema({
    follower: {
        type: String,
        ref: 'User'
    },
    following: {
        type: String,
        ref: 'User'
    }
});

export default mongoose.model('Follow', FollowSchema);
