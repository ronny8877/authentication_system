import { NextFunction, Request, Response } from "express";
import { checkParamsId } from "../middleware/paramsId";
import { auth } from "../middleware/auth";
import User from "../models/user.model";
import { isValidToken } from "../middleware/isValidtoken";
import App_Db from "../models/appDb.model";



const express = require("express");
const router = express.Router();

router.post('/new', [auth], async function (req: Request, res: Response, next: NextFunction) {
    //finding the user 
    let user = await User.findById(req.user._id);
    //this is to satisfy type script as auth middleware function is already  checking this
    if (!user) return res.status(404).send("User not found");
    //if user is not a dev returning access error   
    if (user.type !== "developer") return res.status(400).send(" You do not have sufficient permissions");
    
res.send("You have access to this route");


})



module.exports = router

