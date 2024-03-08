import express from 'express';
import Post from '../models/Post.js';
import auth from '../middlewares/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
    // Get all posts
    const posts = await Post
                        .find()
                        .sort({ createdAt: -1 })
                        .limit(5)
                        .populate({
                            path: 'author',
                            model: User,
                        });
    res.json(posts);
});

router.get('/:id', async (req, res) => {
    // Get a post by ID
    const { id } = req.params;
    const post = await Post.findById(id);
    res.json(post);
});

router.post('/new', auth, async (req, res) => {
    // Create a new post
    const { content } = req.body;
    const post = new Post({ content, userId: req.user._id});
    await post.save();
    res.json(post);
});

router.delete('/:id', auth, async (req, res) => {
    // Delete a post
    const { id } = req.params;
    const post = await Post.findById(id);
    if
    (!post) {
        return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post removed' });
});

export default router;
