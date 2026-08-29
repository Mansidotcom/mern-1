const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "user already exist"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedpassword
        });

        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `Welcome to Shopnet, ${name}! Your OTP for Shopnet registration is: ${otp}`;

            // TEMPORARILY COMMENTED
            // await sendEmail(
            //     email,
            //     "Welcome to Shopnet - Your OTP",
            //     message
            // );

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user)
            });
        }

        return res.status(400).json({
            message: "Invalid user data"
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            return res.status(200).json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user)
            });
        }
        else {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        res.status(200).json(users);
    } catch (error) {
        console.error("GET USERS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers
}