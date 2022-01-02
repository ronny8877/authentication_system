import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

import { NextFunction, Request, Response } from "express";
export function isValidToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header("x-app-token");
    if (!token) return res.status(401).send("Access Denied.");

    if (uuidValidate(token) && uuidVersion(token) === 4) {
        res.status(400).send("Invalid ID");
    } else {
        next();
    }
}