import { NextFunction, Request, Response } from "express";
import { mongo } from "mongoose";
import User, { isValidLogin, isValidUser } from '../models/user.model'
import _ from 'lodash'
import Validator from "../middleware/validator";
const express = require("express");
const router = express.Router();


router.post("/login", [Validator(isValidLogin)], async function (req: Request, res: Response, next: NextFunction) {
    let user = await User.findOne({
        $or: [{
            phone: req.body.phone
        }, {
            email: req.body.email
        }]
    });
    if (!user) return res.status(400).send("User with Given credentials not found");
    if (user.is_blocked) return res.status(400).send("This Account is Banned");

    let temp = new User(user);
    if (!temp.validatePassword(req.body.password, user.password)) return res.status(401).send("Email or Password is incorrect");

    let token = temp.generateJwtToken();
    res.header("x-auth-token", token).status(200).send("Login Successful");

})



router.post("/register", [Validator(isValidUser)] , async function(req:Request, res:Response, next:NextFunction){

    let already_exist = await User.findOne({
        $or: [{
            phone: req.body.phone
        }, {
            email: req.body.email
        }]});
    if (already_exist) return res.status(400).send("User already exists");

    let user = new User(req.body);
    //hashing password
    user.password = await user.hashPassword(user.password);
try{
    await user.save();
    const token = user.generateJwtToken();
    res.header("x-auth-token", token).status(201).send("Registration Complete");
}catch(ex){
    next(ex);
}
}



);




module.exports = router;