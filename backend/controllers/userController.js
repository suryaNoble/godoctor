// user tasks like booking appointments, cancelling appointments and viewing appointments, login, register, payment gateway etc...

import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

// Registering user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill in all fields" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please provide a strong password!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            name, email, password: hashedPassword
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, message: "User created successfully", token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Changing user profile from static to dynamic before getting user details we have to ensure if he is user or not done by authUser.js in middlewares
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        const userData = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData });

    } catch (error) {
        console.log('This is profile section in userController.js');
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !gender) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender });

        if (imageFile) {
            // Cloudinary uploading
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            const imageUrl = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: 'Profile updated' });

    } catch (error) {
        console.log('Error while updating user profile in userController.js');
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, getProfile, updateProfile };
