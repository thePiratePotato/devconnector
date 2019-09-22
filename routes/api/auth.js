const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route GET api/auth
// @desc Test route
// @access Public
// to use middleware, add in the middleware function
router.get('/', authenticate, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route POST api/auth
// @desc Authenticate user and get token
// @access Public

router.post('/', [
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Password is required').exists({
        min: 6
    })
], async(req, res) => {
    // customize the error msg
    const errors = validationResult(req);
    // if there are errors,then throw these customized errors msg
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        // check if the user has already exists????
        let user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }


        // return webtoken
        // res.send('User registered');
        // creating payload, an obj
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload,
            config.get('jwtSecret'), {
                expiresIn: 36000
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
    } catch (err) {
        // server error
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;