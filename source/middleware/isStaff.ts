import { User_token } from './../models/user.model';
import config from "../config";
import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import Logger from "../logging/logger";
const jwt = require("jsonwebtoken");


const NAMESPACE = "isStaff.ts";


const log = new Logger(NAMESPACE);
declare global {
    namespace Express {
        interface Request {
            user: User_token;
        }
    }
}

export async function isStaff(req: Request, res: Response, next: NextFunction) {
    let allowed_types = ["superadmin", "auth_developer"]
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access Denied.");
    try {
        const decoded = await jwt.verify(token, config.SECRET_KEY);
        let user = await User.findById(decoded._id);
        if (!user) return res.status(401).send("Access Denied.");
        if (user.is_blocked.status) return res.status(400).send("This Account is Banned");
        if (!allowed_types.includes(user.type)) return res.status(403).send("You do not have sufficient permissions");
        req.user = decoded;

    } catch (ex) {
        log.error("Error at", ex)
        res.status(400).send("Invalid token");
    }

    next();
}