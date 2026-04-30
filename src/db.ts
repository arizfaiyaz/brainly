import mongoose, { model, Schema } from "mongoose";
import { required } from "zod/mini";

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
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    userId: {type: Schema.Types.ObjectId, ref: 'User',required: true}
})

const ContentModel = model("Content", ContentSchema);

export { ContentModel };

const LinkSchema = new Schema({
    hash: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }
});

export const LinkModel = model("Link", LinkSchema);