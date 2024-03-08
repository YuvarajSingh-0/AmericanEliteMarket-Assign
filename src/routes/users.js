import express from 'express';
import auth from '../middlewares/auth.js';
import Follow from '../models/Follow.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Login from '../models/Login.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    // Get a user by ID
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
});

router.put('/', auth, async (req, res) => {
    // Update a user by ID
    const { id } = req.params;
    const { username, bio, image } = req.body;
    const user = await User.findByIdAndUpdate(id, { username, bio, image });
    if (username!=user.username){
        await Login.findByIdAndUpdate(id, { username });
        user.username = username;
    }
    res.json(user);
});

router.delete('/', auth, async (req, res) => {
    // Delete a user by ID
    if (!req.user || !req.user._id) {
        return res.status(400).json({ msg: 'User not found' });
    }
    const userId = req.user._id;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Delete user's posts
        await Post.deleteMany({ userId: userId }).session(session);

        // Delete user's login credentials
        await Login.deleteOne({ _id: userId }).session(session);

        // Delete user's profile
        const user = await User.deleteOne({ _id: userId }).session(session);

        // If user not found, throw an error
        if (user.deletedCount === 0) {
            throw new Error('User not found');
        }

        // If everything is OK, commit the transaction
        await session.commitTransaction();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        // If anything goes wrong, abort the transaction
        await session.abortTransaction();

        res.status(500).json({ message: 'Error deleting user', error: error });
    } finally {
        // End the session
        session.endSession();
    }

});

router.post('/follow/:id', auth, async (req, res) => {
    const { id } = req.params;

    // Don't allow a user to follow themselves
    if (req.user._id === id) {
        return res.status(400).json({ msg: 'You cannot follow yourself' });
    }

    // Create a follow relationship
    const follow = new Follow({
        follower: req.user.id,
        following: id
    });

    await follow.save();

    res.json({ msg: 'Successfully followed user' });
});

router.delete('/unfollow/:id', auth, async (req, res) => {
    const { id } = req.params;

    // Delete the follow relationship
    await Follow.findOneAndDelete({
        follower: req.user.id,
        following: id
    });

    res.json({ msg: 'Successfully unfollowed user' });
});

router.get('/:id/followers', async (req, res) => {
    const { id } = req.params;

    // Get the followers of the user
    const followers = await Follow.find({ following: id }).populate('follower');
    
    res.json(followers);
});

router.get('/:id/following', async (req, res) => {
    const { id } = req.params;
    
    // Get the users that the user is following
    const following = await Follow.find({ follower: id }).populate('following');
    
    res.json(following);
});

router.get('/following/posts', auth, async (req, res) => {
    try {
        // Get user id from request after auth middleware passes
        const userId = req.user._id;

        // Aggregation pipeline to get the latest posts from users that the given user follows
        const posts = await Follow.aggregate([
            // Match the follower
            { $match: { follower: userId } },
            // Lookup (join) the posts
            {
                $lookup: {
                    from: 'posts',
                    localField: 'following',
                    foreignField: 'author',
                    as: 'posts'
                }
            },
            // Unwind the posts
            { $unwind: '$posts' },
            // Sort by timestamp in descending order
            { $sort: { 'posts.timestamp': -1 } },
            // Limit to 10 posts
            { $limit: 10 },
            // Replace root document with the post document
            { $replaceRoot: { newRoot: '$posts' } }
        ]);
        // Send the posts in the response
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feed', error: error });
    }
});

router.get('/:id/posts', async (req, res) => {
    // Get all posts by the user
    // get search params
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ msg: 'Specify user id' });
    }

    let { page, limit } = req.query 
    // set default values
    page = page || 1;
    limit = limit || 2;
    // convert to number
    page = parseInt(page);
    limit = parseInt(limit);
    // calculate start index
    const startIndex = (page - 1) * limit;
    // get posts
    const posts = await Post
        .find({ author: id })
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(startIndex)
        .populate({
            path: 'author',
            model: User,
        });
        
        // create result object
        const result = {};
        // // add next page if needed
        result.hasMore = page * limit == posts.length;
        // add data to result object
        result.results = posts;
        // send result
        res.json(result);
    });
    
    router.post('/follow/:id', auth, async (req, res) => {
        const { id } = req.params;
        
        // Don't allow a user to follow themselves
        if (req.user._id === id) {
        return res.status(400).json({ msg: 'You cannot follow yourself' });
    }

    // Create a follow relationship
    const follow = new Follow({
        follower: req.user._id,
        following: id
    });

    await follow.save();

    res.json({ msg: 'Successfully followed user' });
});


export default router;
