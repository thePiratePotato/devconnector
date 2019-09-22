const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
// @route GET api/profile/me
// @desc Get current users profile route
// @access Private
router.get('/me', authenticate, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        // check if there is no Profile
        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/profile
// @desc Create or update user profile
// @access Private

router.post('/', [authenticate, [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    });

module.exports = router;