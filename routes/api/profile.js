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

        // pulling all the stuff out from the req.body
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // build project onject
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        // print skills out
        // console.log(profileFields.skills);


        // build social Object
        profileFields.social = {};
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (youtube) profileFields.social.youtube = youtube;



        // print social
        // console.log(profileFields.social);
        // testing on postman
        // res.send("hello");

        try {
            // find by user
            let profile = await Profile.findOne({ user: req.user.id });
            // look for a profile, if there is one

            if (profile) {
                // update Profile
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
                return res.json(profile);
            }
            profile = new Profile(profileFields);
            await profile.save();
            // send back the profile
            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });
// @route  GET request to api /profile
// @desc     get all profiles
// @acess    public
// this is meant to provide a route which displays all users on the profiles
router.get('/', async(req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET request to api /profile/user/:user_id
// @desc     get a particular profile by user_id
// @acess    public
// this is meant to provide a route which displays all users on the profiles
router.get('/user/:user_id', async(req, res) => {
    try {
        const profile = await Profile.findOne({ ser: req.params.user_id }).populate('user', ['name', 'avatar']);

        // check if there is any user-profile
        if (!profile)
            return res.status(400).json({ msg: "Profile not found" });
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: "Profile not found" });
        }
        res.status(500).send('Server Error');
    }
});
// @route   Delete to api /profile
// @desc    Delete profiles, users and posts
// @acess   Private
router.delete('/', authenticate, async(req, res) => {
    try {
        // there is no need for getting anything hence no need for variables


        // function =>>> remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // to remove 
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: "User deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route PUT api/profile/experience
//@desc Add profile exprience
// @access Private
router.put('/experience', [authenticate, [
    check('title', 'Title is required').not().isEmpty(),
    check('compant', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()

]], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // pull
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    // creating new obj
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };
    try {
        // First need to fetch the profile that needed to add the experience
        const profile = await Profile.findOne({ user: req.user.id });
        // using Unshift to push content to newest to latest
        profile.experience.unshift('newExp');
        await profile.save();
        // return the whole profile
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});


module.exports = router;