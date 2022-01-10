import { NextFunction, Request, Response } from "express";
import User, { isValidLogin, isValidUser } from '../models/user.model'
import _ from 'lodash'
import Validator from "../middleware/validator";
import { auth } from "../middleware/auth";
import { checkParamsId } from "../middleware/paramsId";
import App from "../models/app.model";
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
    if (user.is_blocked.status) return res.status(400).send("This Account is Banned");

    let temp = new User(user);
    if (!temp.validatePassword(req.body.password, user.password)) return res.status(401).send("Email or Password is incorrect");

    let token = await temp.generateJwtToken();
    //setting the header

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
});



// a function to get Users information
router.get("/", [auth], async function (req: Request, res: Response, next: NextFunction) {
    try {
        let user = await User.findById(req.user._id).select("-password -app_access   -token");
        if (!user) return res.status(404).send("User not found");
        res.status(200).send(user);
    } catch (ex) {
        next(ex);
    }
});


// a function to update Users information
router.put("/:id", [auth, checkParamsId], async function (req: Request, res: Response, next: NextFunction) {
    try {
        let user = await User.findById(req.params.id);
        if (!user && user === null) return res.status(404).send("User not found");

        await user.save();
        res.status(200).send("User updated successfully");
    } catch (ex) {
        next(ex);
    }
});




//join as a developer
router.post("/join/developer", [auth], async function (req: Request, res: Response, next: NextFunction) {
    try {
        let user = await User.findById(req.user._id);
        if (!user && user === null) return res.status(404).send("User not found");
        if (user.is_blocked.status) return res.status(400).send("This Account is Banned");
        if (user.type === "developer") return res.status(400).send("This user is already a developer");

        await user.update({
            $set: {
                type: "developer"
            }
        });
        res.status(200).send("Congratulations You are now a developer");
    } catch (ex) {
        res.status(500).send("Something went wrong");
        next();

    }
});


//get the all apps_access
router.get("/apps_access", [auth], async function (req: Request, res: Response, next: NextFunction) {
    try {
        let user = await User.findById(req.user._id);
        if (!user && user === null) return res.status(404).send("User not found");
        if (user.is_blocked.status) return res.status(400).send("This Account is Banned");

        if (!user.app_access.length) return res.status(404).send("No Apps Access");
        let apps: any = []
        let temp: any = {}

        for (let i = 0; i < user.app_access.length; i++) {
            let app: any = await App.findById(user.app_access[i].app_id).select("app_name alias");
            if (app) {
                temp = {
                    app_name: app.app_name,
                    alias: app.alias,
                    signed_in_at: user.app_access[i].signed_in_at
                }
                apps.push(temp);
            }
            else {
                return res.send("App not found");
            }

        }

        res.status(200).send(apps);
    } catch (ex) {
        next(ex);
    }
});





module.exports = router;