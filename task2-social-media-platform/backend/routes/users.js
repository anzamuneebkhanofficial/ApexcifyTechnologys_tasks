const express = require('express');
const router = express.Router();
const User = require('../models/User');
router.post('/', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }
        let user = await User.findOne({ username });
        if (!user) {
            user = await User.create({ username });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers', 'username')
            .populate('following', 'username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.post('/:id/follow', async (req, res) => {
    try {
        const { currentUserId } = req.body;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {

            currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
        } else {

            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
