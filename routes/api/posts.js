const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authen');


// @route GET api/post
// @desc Test route
// @access Public
router.get('/', (req, res) => res.send('Post router'));

module.exports = router;