import { NextFunction, Request, Response } from "express";
import { checkParamsId } from "../middleware/paramsId";
import { auth } from "../middleware/auth";
import User from "../models/user.model";

import App_Db from "../models/appDb.model";
import App, { validateApp } from "../models/app.model";
import Validator from "../middleware/validator";
import { nanoid } from "nanoid";
import Logger from "../logging/logger";
import Plan from "../models/plan.model";


const express = require("express");
const router = express.Router();

const NAMESPACE = "app_routes"
const log = new Logger(NAMESPACE)


router.post('/new', [Validator(validateApp), auth], async function (req: Request, res: Response, next: NextFunction) {
  // Its FUCKING RETARDED

    //finding the user 
    let user = await User.findById(req.user._id);
    //this is to satisfy type script as auth middleware function is already  checking this
    if (!user) return res.status(404).send("User not found");


    //if user is not a dev returning access error   
    if (user.type !== "developer") return res.status(400).send(" You do not have sufficient permissions");
    
    //creating new app

    let app = await App.findOne({
        app_name: req.body.app_name
    })
    if (app) return res.status(400).send("App already exists");
    req.body.app_name = req.body.app_name.toLowerCase() + "-" + nanoid();



    //finding a plan which have type free
    let plan = await Plan.findOne({
        type: "free"
    })
    if (!plan) return res.status(400).send("Compatibility issue");
    //adding the app to the plan

    let user_plan = {
        plan_id: plan._id,
    }

    req.body.created_by = req.user._id;
    req.body.active_plan = user_plan;

    //saving the app

    let newApp = new App(req.body);
    let newApp_Db = new App_Db({
        app_name: req.body.app_name,
        app_id: newApp._id,
        //pushing app token
        app_token: newApp.app_token,

    })
    newApp.db_token = { token: newApp_Db._id }

    try {
        await newApp.save();
        await newApp_Db.save();
        res.status(201).send("App Created")
    } catch (ex) {
        log.error("Error ", ex); 
        res.status(500).send("Something went wrong");

    }





})



router.get('/get', [auth], async function (req: Request, res: Response, next: NextFunction) {

    //finding all the app that have created_by as the user
    let app = await App.find({
        created_by: req.user._id
    }).select("app_name app_id app_token alias created_at");

    if (!app.length) return res.status(404).send("No apps found");

    res.status(200).send(app)

})



router.get('/get/:id', [auth, checkParamsId], async function (req: Request, res: Response, next: NextFunction) {

    //finding the app
    let app = await App.findById(req.params.id).select("-db_token -created_by -__v");
    if (!app) return res.status(404).send("App not found");

    res.status(200).send(app)


})

module.exports = router

