const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

//ROUTE::1 Create a user using POST ---> NO LOGIN REQUIRED
router.post('/register', [
    body('name', "Enter a valid Name").isLength({ min: 3 }),
    body('email', "Enter a valid Email Address").isEmail(),
    body('password', "Password must be atleast 5 characters including UPPERCASE, lowercase, special characters and Numbers").isLength({ min: 5 })

], async (req, res) => {

    let success = false;
    //if there are errors give invalid Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //to check whether the user with same email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({
                error: "A user with this email already exists"
            })
        }
        const salt = await bcrypt.genSaltSync(10);
        const plaintextPassword = await bcrypt.hashSync(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: plaintextPassword,
        })

        const userdata = {
            user: {
                id: user.id
            }
        }

        //a variable for signature
        const sign = "hi!thisisprinceverifyingtheuser@69$12346978";

        // Giving the details A JsonWebToken to maximize the security
        const authtoken = jwt.sign(userdata, sign);
        success = true
        res.json({success, authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE::2   Authenticating a user using POST ---> NO SIGN UP REQUIRED {THIS IS LOGIN} 
router.post('/login', [
    body('email', "Enter a valid Email Address").isEmail(),
    body('password', "Password must be atleast 8 characters including UPPERCASE, lowercase, special characters and Numbers").exists(),

], async (req, res) => {

    let success = false;

    //if there are errors give invalid Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {

        let user = await User.findOne({ email })
        if (!email) {
            return res.status(400).json({ error: "Invalid! User doesn't exist. Please Try with correct credentials" })
            
        }
        const passwordcompare = await bcrypt.compare(password, user.password)
        if (!passwordcompare) {
            success = false ;
            return res.status(400).json({ success , error: "Invalid!, Please Try with correct credentials" })
        }

        const userdata = {
            user: {
                id: user.id
            }
        }

        const sign = "hi!thisisprinceverifyingtheuser@69$12346978";
        const authtoken = jwt.sign(userdata, sign);
         success = true
        res.json({ success , authtoken })


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE::3 Get a user details using POST ---> LOGIN REQUIRED
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user =  await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;