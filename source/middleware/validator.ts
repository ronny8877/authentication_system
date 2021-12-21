import {Request ,Response,NextFunction} from "express";
const Validator = function (validate:Function){
return (req:Request, res:Response, next:NextFunction) => {
    const {error} = validate(req.body);
    if(error){
        res.status(401).send( error.details[0].message);
        return;
    }
    next();
}
}

export default Validator;