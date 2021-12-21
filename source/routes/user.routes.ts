import { NextFunction, Request, Response } from "express";
import { mongo } from "mongoose";
import Logger from "../logging/logger";
import User, { isValidUser } from '../models/user.model'
import _ from 'lodash'
import Validator from "../middleware/validator";
const express = require("express");
const router = express.Router();


//Name space
const NAMESPACE = "user.routes.ts";

let log:Logger = new Logger(NAMESPACE);

router.get("/", function(req:Request, res:Response, next:NextFunction){

    res.setHeader("x-auth-token", "Hello World").send("Hello World");
})


router.post("/register", [Validator(isValidUser)] , async function(req:Request, res:Response, next:NextFunction){

    let user = await User.findOne({
        $or: [{
            phone: req.body.phone
        }, {
            email: req.body.email
        }]});
if(user) return res.status(400).send("User already exists");

     user= new User( req.body);
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