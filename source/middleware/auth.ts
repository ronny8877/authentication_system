import config from "../config";
import { NextFunction, Request, Response } from "express";
import User, { User_token } from "../models/user.model";
const jwt = require("jsonwebtoken");



declare global {
  namespace Express {
    interface Request {
      user: User_token;
    }
  }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied.");
  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    let user = await User.findById(decoded._id);
    if (!user) return res.status(401).send("Access Denied.");
    if (user.is_blocked.status) return res.status(400).send("This Account is Banned");
    req.user = decoded;


    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}


