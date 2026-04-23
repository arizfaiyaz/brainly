import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import z from 'zod';
import dotenv from 'dotenv';
dotenv.config();
import { UserModel } from './db.js';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

const JWT_PASSWORD = process.env.JWT_PASSWORD;
if (!JWT_PASSWORD) {
    throw new Error('JWT_PASSWORD environment variable is not defined');
}
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    throw new Error('MONGO_URL environment variable is not defined');
}
mongoose.connect(MONGO_URL);

app.post('/api/v1/signup', async (req, res) => {
    //zod validation for req.body
    const username = req.body.username;
    const password = req.body.password;

    try {
    await UserModel.create({
        username,
        password
    });

    res.status(201).json({
        message: 'User created successfully',
    })
} catch (err) {
    res.status(400).json({
        message: 'Error creating user',
    })
}
});
 
app.post('/api/v1/signin', async (req, res) => {

    const { username, password } = req.body;
    const user = await UserModel.findOne({
        username, password
    });
    if(!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }
    const token = jwt.sign({ id: user._id }, JWT_PASSWORD);

    res.json({ token });

});

app.get('/api/v1/content', (req, res) => {

});

app.delete('/api/v1/content', (req, res) => {

});

app.post('/api/v1/brain/share', (req, res) => {

});

app.get('/api/v1/brain/:shareLink', (req, res) => {

});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});