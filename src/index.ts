import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import z from 'zod';
import dotenv from 'dotenv';
dotenv.config();
import { UserModel } from './db.js';
// import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    throw new Error('MONGO_URL environment variable is not defined');
}
mongoose.connect(MONGO_URL);

app.post('/api/v1/signup', async (req, res) => {
    //zod validation for req.body
    const username = req.body.username;
    const password = req.body.password;

    // const hashedPassword = bcrypt.hash(password, 5)
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

app.post('/api/v1/signin', (req, res) => {

});

app.get('/api/v1/content', (req, res) => {

});

app.delete('/api/v1/content', (req, res) => {

});

app.post('/api/v1/brain/share', (req, res) => {

});

app.get('/api/v1/brain/:shareLink', (req, res) => {

});