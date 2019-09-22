const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');


// @route GET api/profile/me
// @desc Get current users profile route
// @access Private
router.get('/', auth, (req, res) => res.send('profile router'));

module.exports = router;