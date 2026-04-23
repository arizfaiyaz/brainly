import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { ContentModel, UserModel } from './db.js';
import { userMiddleware } from './middleware.js';
import { JWT_PASSWORD } from './config.js';

const app = express();
app.use(express.json());



const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    throw new Error('MONGO_URL environment variable is not defined');
}
mongoose.connect(MONGO_URL);

// User signup
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

// User signup
app.post('/api/v1/signin', async (req, res) => {
try{
    const { username, password } = req.body;
    
    const user = await UserModel.findOne({
        username, password
    });
    if(!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }
    const token = jwt.sign({ id: user._id }, JWT_PASSWORD, { expiresIn: '1d' });

     res.json({ token });
} catch (error) {
    res.status(500).json({
        message: "Internal server error"
    });
}

});

app.post('/api/v1/content', userMiddleware, async (req, res) => {
    const { link, title, type } = req.body;

    await ContentModel.create({
        link,
        type,
        title,
        //@ts-ignore
        userId: req.userId,
        tags: [

        ]
    })

    return res.json({
        message: "Content Added successfully"
    })
});

app.get('/api/v1/content', userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
         userId: userId 
        }).populate('userId', 'username');

    return res.json({
        content
    })
});


app.delete('/api/v1/content', userMiddleware, async (req, res) => {
    const { contentId } = req.body;

    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    });
});

app.post('/api/v1/brain/share', userMiddleware, (req, res) => {

});

app.get('/api/v1/brain/:shareLink', userMiddleware, (req, res) => {

});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});