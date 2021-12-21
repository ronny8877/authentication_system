const mongoose = require('mongoose');
import { NextFunction, Request, Response } from "express";
export function checkParamsId(req:Request, res:Response, next:NextFunction) {
    if (!req.params.id) return res.status(400).send('parameters cannot be empty');

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).send("Invalid ID");
    } else {
        next();
    }
}