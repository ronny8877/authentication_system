import config from "../config";
import { NextFunction, Request, Response } from "express";
import User, { User_token } from "../models/user.model";
import Logger from "../logging/logger";
const jwt = require("jsonwebtoken");
const NAMESPACE = "auth.ts";


const log = new Logger(NAMESPACE);

declare global {
  namespace Express {
    interface Request {
      user: User_token;
    }
  }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token")?.trim();
  if (!token) return res.status(401).send("Access Denied.");
  try {
    const decoded = await jwt.verify(token, config.SECRET_KEY);
    let user = await User.findById(decoded._id);
    if (!user) return res.status(401).send("Access Denied. User not found");
    if (user.is_blocked.status) return res.status(400).send("This Account is Banned");
    req.user = decoded;


    next();
  } catch (ex: any) {
    log.error(ex.message, ex)
    res.status(400).send("Invalid token");
  }
}


