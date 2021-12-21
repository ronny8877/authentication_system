import mongoose, {
    Schema
} from "mongoose";
import UserInterface from "../interfaces/user";
import  config from "../config"
import Joi from "joi";
const jwt = require('jsonwebtoken')
const userSchema = new Schema({
    name: {
        type: String,
        maxlength: 64,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
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
    role: {
        type: String,
        enum: ['admin', 'user', 'mod', 'guest', 'developer']

    },
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date,
    dob: Date,
    isVerified: Boolean,
    isBlocked: Boolean,
    app_access: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apps'
    },
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

interface token{
    _id:string;
    name: string
    email:string
}

userSchema.methods.generateJwtToken= function():token {
   
    return jwt.sign({
        _id:this._id,
        name:this.name,
        email:this.email,
    },config.SECRET_KEY)
}

userSchema.methods.isUnique= function():boolean {
    //if the user with given name or email already exists
    //then return an error
    const user = User.findOne({
        $or: [{
            phone: this.phone
        }, {
            email: this.email
        }]
    })
    if (!user) return false
    else return true

}


const validateUser = (user:any)=>{
   
//validating properties of user before saving using Joi
const schema = Joi.object({
    name: Joi.string().min(3).max(64).required(),
    email: Joi.string().min(5).max(255).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(5).max(255).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: Joi.ref('password'),
    gender: Joi.string().valid("male", "female","others").required(),
    phone: Joi.number().required().min(10),
    role: Joi.string().valid('admin', 'user', 'mod', 'guest', 'developer'),
    isActive: Joi.boolean(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    dob: Joi.date(),
    isVerified: Joi.boolean(),
    isBlocked: Joi.boolean(),
    app_access: Joi.string(),
})
return schema.validate(user)
}

const User = mongoose.model <UserInterface> ("users", userSchema);
export {validateUser as isValidUser}
export default User;
