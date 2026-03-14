import { model, Schema } from "mongoose";

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

