import mongoose, { model, Schema } from "mongoose";
import type { required } from "zod/mini";

// const UserModel =  new Model('User', new Schema({
//     username: {type: String, required: true, unique: true},
//     password: String
// }));

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: String
})

const UserModel = model("User", UserSchema);

export { UserModel };

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User',required: true}
})

const ContentModel = model("Content", ContentSchema);

export { ContentModel };