const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
router.post('/', async (req, res) => {
    try {
        const { user, content } = req.body;
        if (!user || !content) {
            return res.status(400).json({ message: 'User and content are required' });
        }
        const post = await Post.create({ user, content });
        await post.populate('user', 'username');
        res.status(201).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({ message: isLiked ? 'Post unliked' : 'Post liked', likes: post.likes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
            .populate('user', 'username')
            .sort({ createdAt: 1 });
        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.post('/:id/comments', async (req, res) => {
    try {
        const { user, content } = req.body;
        if (!user || !content) {
            return res.status(400).json({ message: 'User and content are required' });
        }
        const comment = await Comment.create({
            post: req.params.id,
            user,
            content
        });
        await comment.populate('user', 'username');
        res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
