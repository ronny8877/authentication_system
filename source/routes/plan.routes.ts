import { NextFunction, Request, Response } from "express";
import Logger from "../logging/logger";
import { isStaff } from "../middleware/isStaff";
import { checkParamsId } from "../middleware/paramsId";
import Validator from "../middleware/validator";
import Plan, { isValidPlan } from "../models/plan.model";


const express = require("express");
const router = express.Router();
const NAMESPACE = "plan_routes";
const log = new Logger(NAMESPACE);




router.post('/new', [Validator(isValidPlan), isStaff], async function (req: Request, res: Response, next: NextFunction) {
    req.body.created_by = req.user._id;
    const plan = new Plan(req.body);

    try {
        await plan.save();

        res.status(201).send("Plan Created successfully")

    } catch (ex) {
        log.error("Error ", ex);
        res.status(500).send("Something went wrong");

    }

    next()
})


router.get('/all', async function (req: Request, res: Response, next: NextFunction) {
    try {
        let plans = await Plan.find({}).select("-created_by -__v");
        if (!plans.length) return res.status(404).send("No plans found");

        res.status(200).send(plans)
    } catch (ex) {
        log.error("Error ", ex);
        res.status(500).send("Something went wrong");

    }
    next()
})


router.get('data/:id', checkParamsId, async function (req: Request, res: Response, next: NextFunction) {
    try {
        let plan = await Plan.findById(req.params.id).select("-created_by -__v");
        if (!plan) return res.status(404).send("Plan not found");
        //if plan is an empty object send an error
        res.status(200).send(plan)


    } catch (ex) {
        log.error("Error ", ex);
        res.status(500).send("Something went wrong");

    }
    next()
})






module.exports = router;