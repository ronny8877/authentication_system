

import { NextFunction, Request, Response } from "express";
import App from '../models/app.model';
import { User_token } from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user: User_token;
        }
    }
}

export async function haveSecreteKey(req: Request, res: Response, next: NextFunction) {
    const token = req.header("x-app-token");

    if (!token) return res.status(401).send("Access Denied.");

    let ap = await App.findOne({ secrete_key: token })
    if (!ap) return res.status(401).send("Access Denied.");
    else {
        let temp = {
            _id: ap._id,
            app_key: ap.secrete_key,

        }
        req.user = temp;
        next();
    }
}