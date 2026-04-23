import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { ContentModel, UserModel, LinkModel } from './db.js';
import { userMiddleware } from './middleware.js';
import { JWT_PASSWORD } from './config.js';
import { hash } from 'bcrypt';
import { random } from './utils.js';
import cors from "cors";
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
    const { link, title } = req.body;

    await ContentModel.create({
        link,
        title,
        
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

        userId: req.userId
    });
    res.json({
        message: "Content deleted successfully"
    })
});

// Route 6: SHare Content link
app.post('/api/v1/brain/share', userMiddleware, async (req, res) => {
    const { share } = req.body;
    if(share) {
        const existingLink = await LinkModel.findOne({
            userId: req.userId
        });
        if(existingLink) {
            res.json({
                hash: existingLink.hash});
                return;
        }
        const hash = random(10);
        await LinkModel.create({
            userId: req.userId,
            hash
        });
        res.json({ hash });
        } else {
            await LinkModel.deleteOne({
                userId: req.userId
            });
            res.json({
                message: "Link deleted successfully"
            });
        }
});

app.get('/api/v1/brain/:shareLink', userMiddleware, async (req, res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    })
    if(!link) {
        res.status(404).json({
            message: "User not found"
        })
    }

    const content = await ContentModel.find({
        userId: link.userId
    })
    const user = await UserModel.findOne({
        _id: link.userId
    });

    if(!user) {
        res.status(404).json({
            message: "User not found"
       });
       return;
    } 
    res.json({
        username: user.username,
        content
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});