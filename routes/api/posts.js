const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authen');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');



// @route POST api/post
// @desc Create a post
// @access Private, must login to create a post
router.post('/', [authenticate, [
    check('text', 'Text is required').not().isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});
// @route GET api/post
// @desc dispay all posts from a single user
// @access Private, must login to create a post
router.get('/', authenticate, async(req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/post/:id
// @desc GET post by id
// @access Private, must login to create a post
router.get('/:id', authenticate, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.json(post);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send('Server Error');
    }
});
// @route DELETE api/posts/:id
// @desc DELETE a post
// @access Private, must login to delete
router.delete('/:id', authenticate, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }


        // check user by matching the posts to users
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        await post.remove();

        res.json({ msg: 'Post removed' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;