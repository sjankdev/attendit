const bcrypt = require('bcryptjs');
const User = require('../models/User');

const registerUser = async (req, res) => {
    const { username, email, password, role = 'participant' } = req.body;

    try {
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await User.create(username, email, hashedPassword, role);

        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { registerUser };
