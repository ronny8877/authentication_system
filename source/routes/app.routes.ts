import { NextFunction, Request, Response } from "express";
import { checkParamsId } from "../middleware/paramsId";
import { auth } from "../middleware/auth";
import User from "../models/user.model";
import { isValidToken } from "../middleware/isValidtoken";
import App_Db from "../models/appDb.model";
import App, { validateApp } from "../models/app.model";
import Validator from "../middleware/validator";
import { nanoid } from "nanoid";
import Logger from "../logging/logger";


const express = require("express");
const router = express.Router();

const NAMESPACE = "app_routes"
const log = new Logger(NAMESPACE)


router.post('/new', [Validator(validateApp), auth], async function (req: Request, res: Response, next: NextFunction) {
    //finding the user 
    let user = await User.findById(req.user._id);
    //this is to satisfy type script as auth middleware function is already  checking this
    if (!user) return res.status(404).send("User not found");


    //if user is not a dev returning access error   
    if (user.type !== "developer") return res.status(400).send(" You do not have sufficient permissions");
    
    //creating new app

    let app = await App.findOne({
        name: req.body.app_name
    })
    if (app) return res.status(400).send("App already exists");
    req.body.app_name = req.body.app_name.toLowerCase() + nanoid();

    let newApp = new App(req.body);

    let newApp_Db = new App_Db({
        app_name: req.body.app_name,
        app_id: newApp._id,
        app_token: newApp.app_token,

    })

    try {
        await newApp.save();
        await newApp_Db.save();
        res.status(201).send("App Created")
    } catch (ex) {
        log.error("Error ", ex);
        res.send("Something went wrong");

    }



    res.send("App Created")

})



module.exports = router

