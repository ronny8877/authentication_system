import { NextFunction, Request, Response } from "express";
import { haveSecreteKey } from "../middleware/haveSecrateKey";
import App from "../models/app.model";
import QRCode from 'qrcode'
import { auth } from "../middleware/auth";
import { v4 } from "uuid";
import User from "../models/user.model";
import App_Db from "../models/appDb.model";
import { checkParamsId } from "../middleware/paramsId";
const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");

router.get("/method/qr", [haveSecreteKey], async function (req: Request, res: Response, next: NextFunction) {
    let db = admin.database()
    let ref = db.ref("SignInWith/");
    let doc_id = v4();
    const app: any = await App.findOne({ secrete_key: req.user.app_key })
    if (!app) res.send(404).send("App not found")
    if (app === null) res.status(404).send("App not found")
    //creating a document in firebase db
    // {
    //     "app_name": "test",
    //   "app_id": "test",
    //     "app_token": "test",
    //status:pending,
    //created_at: new Date,
    //duration:is 5 mins
    //user_id:user._id
    //isProcessed:false
    // }
    const req_doc = {
        app_name: app.app_name,
        app_id: app._id.toString(),
        app_token: app.app_token,
        status: "pending",
        created_at: Date.now(),
        isProcessed: false,
        //duration is 5 mins in time
        duration: Date.now() + 300000,
        user_id: ""


    }

    try {

        const user_ref = await ref.child(doc_id).set(req_doc)
        const qr = await QRCode.toDataURL(`name:${app.app_name}, id:${doc_id}`)
        res.send({ id: doc_id, qr })
    } catch (err) {
        console.log(err)
        res.status(500).send("Internal server Error")
    }
});


router.get('/req/status/:id', [auth, haveSecreteKey], async function (req: Request, res: Response, next: NextFunction) {
    if (req.params.id === undefined) return res.status(404).send("Please provide a valid id")
    let db = admin.database()
    let ref = db.ref(`SignInWith/${req.params.id}`);

    try {
        ref.once("value", async function (snapshot: any) {

            if (snapshot.val() === null) return res.status(404).send("No request found")
            if (snapshot.val().status === "pending") return res.status(200).send("Request is pending")
            if (snapshot.val().status === "accepted") {
                let user = await User.findById(snapshot.val().user_id).select("display_name email phone gender")
                if (!user) return res.status(404).send("User not found")
                return res.status(203).send({ status: "Accepted", user })
            }
            if (snapshot.val().status === "rejected") return res.status(400).send("Request is rejected")
            if (snapshot.val().status === "expired") return res.status(400).send("Request is expired")
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal server Error")
    }
})

//getting a user of an app
router.get('/user/:id', [haveSecreteKey, checkParamsId], async function (req: Request, res: Response, next: NextFunction) {
    const app: any = await App.findOne({ secrete_key: req.user.app_key })
    if (!app) return res.status(404).send("App not found")

    const app_db = await App_Db.findOne({ app_id: app._id })
    if (!app_db) return res.status(404).send("App not found")

    //if the apps users array do not have user with params.id then return error
    if (!app_db.users.length) return res.status(400).send("No user found")
    for (let i = 0; app_db.users.length; i++) {

        if (app_db.users[i].uid && app_db.users[i].uid.toString() === req.params.id) {
            let user = await User.findById(req.params.id).select("-__v  -password -type -is_phone_verified -is_phone_verified -is_email_verified -user_token -app_access")
            return res.status(200).send(user)
        }

    }

})




router.get('/req/handel/:id', [auth], async function (req: Request, res: Response, next: NextFunction) {
    if (req.params.id === undefined) return res.status(404).send("Please provide a valid id")
    let db = admin.database()
    let ref = db.ref(`SignInWith/${req.params.id}`);
    //checking if the document exists
    // if (!ref.exists()) return res.status(400).send("Invalid ID")

    //checking the status of the document

    try {

        ref.once("value", async function (snapshot: any) {
            if (snapshot.val() === null) return res.status(404).send("No request found")
            if (snapshot.val().isProcessed === true) return res.status(400).send("Session processed")
            if (snapshot.val().status === "rejected") return res.status(400).send("Request is rejected")
            if (snapshot.val().status === "expired") return res.status(400).send("Session Expired")
            if (snapshot.val().status === "accepted") return res.status(400).send("Already accepted")

            //checking if the document older then 5 minutes

            if (Date.now() > snapshot.val().duration) {
                ref.update({
                    status: "expired",
                    isProcessed: true
                })
                return res.status(400).send("Session Expired")
            }

            //finding the user
            const user = await User.findById({ _id: req.user._id })
            if (!user) return res.status(404).send("User not found")


            //finding the app with given app_id
            const app = await App.findById({ _id: snapshot.val().app_id })
            if (!app) return res.status(404).send("App not found")
            if (!app.is_active) res.status(401).send("App is not active anymore")
            //checking if the user is already signed in with given app
            let already_signed_in = false
            user.app_access.forEach(async (app: any) => {
                if (app.app_id.toString() === snapshot.val().app_id) {
                    already_signed_in = true

                }
            })
            if (already_signed_in) {
                await ref.update({
                    user_id: user._id,
                    status: "accepted",
                    isProcessed: true
                })
                return res.status(200).header("x-auth-token", user.generateJwtToken()).send(user.generateJwtToken())

            }
            //finding the app_db of the app
            const app_db = await App_Db.findOne({ app_id: app._id })
            if (!app_db) return res.status(404).send("App_Db not found")


            //saving the user in the app_db
            await app_db.updateOne({
                $push: {
                    users: {
                        uid: user._id,
                        user_token: user.user_token,
                    }
                }
            })

            await app.updateOne({
                $inc: {
                    "total_usage.request_count": 1
                }
            })

            //updating the user app_access
            await user.updateOne({
                $push: {
                    app_access: {
                        app_id: app._id,

                        access_token: app.app_token,
                    }
                }
            })
            if (snapshot.val().status === "pending") {
                ref.update({ status: "accepted", user_id: user._id, isProcessed: true })
                return res.status(200).setHeader("x-auth-token", user.generateJwtToken()).send(user.generateJwtToken())
            }



        });
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Internal server Error")
    }
})

module.exports = router