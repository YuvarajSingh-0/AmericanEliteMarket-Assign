import express from 'express';
import Post from '../models/Post.js';
import auth from '../middlewares/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 5);
    // Get all posts with pagination
    const posts = await Post
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
            path: 'author',
            model: User,
        });
    res.json(posts);
});

router.get('/:id', async (req, res) => {
    // Get a post by ID
    const { id } = req.params;
    const post = await Post.findById(id).populate({
        path: 'author',
        model: User,
    });
    res.json(post);
});

router.post('/new', auth, async (req, res) => {
    // Create a new post
    const { content } = req.body;
    const post = new Post({ content, userId: req.user._id });
    await post.save();
    res.json(post);
});

router.delete('/:id', auth, async (req, res) => {
    // Delete a post
    const { id } = req.params;
    const post = await Post.findByIdAndDelete({ _id: id, author: req.user._id });
    if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json({ msg: 'Post removed' });
});

export default router;
