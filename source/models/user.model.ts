import mongoose, {
    Mongoose,
    Schema
} from "mongoose";
import UserInterface from "../interfaces/user";
import  config from "../config"
import Joi from "joi";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
const jwt = require('jsonwebtoken')
const userSchema = new Schema({
    display_name: {
        type: String,
        maxlength: 64,
        minlength: 3
    },
    type: {
        type: String,
        default: "user",
        enum: ['admin', 'user', 'mod', 'guest', 'developer', 'superadmin', "auth_developer"],
    },

    email: {
        type: String,
        unique: true,
        required: true,
        maxlength: 255,
        minlength: 5
    },
    password: {
        type: String,
        maxlength: 255,
        minlength: 5
    },
    phone: {
        type: Number,
        unique: true,
        maxlength: 20,
        required: true
    },

    display_picture: String
    ,
    user_token
        : {
        unique: true,
        type: String,
        required: true,
        default: uuidv4
    },
    is_active: Boolean,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    dob: Date,
    is_email_verified: { type: Boolean, default: false },
    is_phone_verified: { type: Boolean, default: false },
    is_blocked: {
        reason: {
            type: String,
            maxlength: 255,
        },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: Boolean, default: false },
        since: { type: Date, },
        type: { type: String, enum: ["temporary", "permanent"] },
        to: { type: Date }
    },
    app_access:
        [{
            app_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Apps',
                unique: true,
            },
            access_token: {
                type: String,
                unique: true,

            },
            is_active: {
                type: Boolean,
                default: true
            },
            signed_in_at: {
                type: Date,
                default: Date.now
            }
        }],
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'others']
    },


});

userSchema.methods.confirmPassword = function(pass:string,confirmPassword:string) {
//confirming password before saving user to do
if(pass===confirmPassword) return true
else return false
}

export interface User_token {
    id: string;
    display_name: string
    email:string
    user_token: string
}

userSchema.methods.generateJwtToken = function (): User_token {
   
    return jwt.sign({
        user_token: this.user_token,
        id: this._id,
        display_name: this.display_name,
        email:this.email,
    },config.SECRET_KEY)
}



userSchema.methods.hashPassword = function (password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.validatePassword = function (password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
}


const validateLogin = (user: any) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6).max(56),
        phone: Joi.string()
    })
    return schema.validate(user)

}


const validateUser = (user: any) => {

    //validating properties of user before saving using Joi
    const schema = Joi.object({
        display_name: Joi.string().min(3).max(64).required(),
        email: Joi.string().min(5).max(255).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().min(6).max(30).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
        gender: Joi.string().valid("male", "female", "others").required(),
        phone: Joi.string().required().min(10).max(18),
        dob: Joi.date(),
    })
    return schema.validate(user)
}


const User = mongoose.model<UserInterface>("Users", userSchema);
export {validateUser as isValidUser}
export { validateLogin as isValidLogin }
export default User;
