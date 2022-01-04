import { NextFunction, Request, Response } from "express";
import { checkParamsId } from "../middleware/paramsId";
import { auth } from "../middleware/auth";
import User from "../models/user.model";
import { isValidToken } from "../middleware/isValidtoken";

const express = require("express");
const router = express.Router();

router.post("/new/:id", [auth, checkParamsId, isValidToken], async function (req: Request, res: Response, next: NextFunction) {
    //finding the user 
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    //if user is not a dev returning access error 
    if (user.type !== "dev") return res.status(400).send(" You do not have sufficient permissions ");

    //generating a new token
    let token = user.generateJwtToken();
    res.header("x-app-token", token).status(200).send("Token generated");





})

module.exports = router;