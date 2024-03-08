import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        ref: 'Login',
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    bio: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
    },
});

export default mongoose.model('User', UserSchema);
