import { NextFunction, Request, Response } from "express";
import { apps } from "firebase-admin";
import { auth } from "../middleware/auth";
import { checkParamsId } from "../middleware/paramsId";
import App from "../models/app.model";
import App_Db from "../models/appDb.model";
import User from "../models/user.model";
const express = require("express");
const router = express.Router();

router.get('/all/apps', [auth], async function (req: Request, res: Response, next: NextFunction) {

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("User not found");
        if (user.type !== "developer") return res.status(400).send("You do not have sufficient permissions");
        const apps = await App.find({ created_by: req.user._id }).select("-__v -is_blocked");
        if (!apps.length) return res.status(400).send("No Apps found");
        res.status(200).send(apps);



    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Internal server Error")
    }


})


//to get all users of the apps
router.get('/all/users/:id', [auth, checkParamsId], async function (req: Request, res: Response, next: NextFunction) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("User not found");
        if (user.type !== "developer") return res.status(400).send("You do not have sufficient permissions");


        const app_db = await App_Db.findOne({ app_id: req.params.id }).select("-__v");

        if (!app_db) return res.status(400).send("App not found");

        if (!app_db.users.length) return res.status(400).send("No Users found");


        //find all the users of the app
        let users = [];
        for (let i = 0; i < app_db.users.length; i++) {
            const u_list = await User.findById(app_db.users[i].uid).select("-__v -password -is_blocked -role -app_access");
            if (!u_list) return res.status(400).send("App not found");
            users.push(u_list);
        }
        res.status(200).send(users);
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("Internal server Error")
    }


})
module.exports = router

