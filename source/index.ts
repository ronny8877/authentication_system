import http from "http";
import express from "express";
import config from "./config";
import Logger from "./logging/logger";


const NAMESPACE = "index.ts";
//express initialization
const app = express();

const log = new Logger(NAMESPACE);
const server = http.createServer(app);
//using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//logging every request and response
app.use((req, res, next) => {
  log.info(
    `METHOD: [ ${req.method}] -URL: [${req.url}] -IP [${req.socket.remoteAddress}] :`
  );

  res.on("finish", () => {
    log.info(
      ` METHOD: [ ${req.method}] -URL: [${req.url}] STATUS: [${res.statusCode}] -IP [${req.socket.remoteAddress}]`
    );
  });

  next();
});

//API_RULES
app.use((req, res, next) => {
  //TODO: Whitelist only the apps/sites ip address
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //exposing custom header x-auth-token
  res.header("Access-Control-Expose-Headers", "x-auth-token");
  res.header("Access-Control-Expose-Headers", "x-app-token");
  //letting user know what is possible
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//initialization of routes
import routes from "./startup/init_routes";
import db from "./startup/init_db";
import init from '../source/startup/init_firebase';

db();
routes(app);
init()
//starting the server

log.warn(`Serving on Host ${process.env.HOSTNAME}`);
server.listen(config.port, () => {
  console.info(
    `Listening on port ${config.port}...in ${process.env.NODE_ENV} environment `
  );
});



module.exports= server;
//TELL ME A PROGRAMMING JOKE
//YOUR CODE


//here lies my selfesteem as a programmer
//roasted by github copilot