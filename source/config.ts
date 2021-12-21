import dotenv from "dotenv";

dotenv.config();
const APP_NAME = "Auth";
const SECRET_KEY = process.env.jwt_key  || "TEST_KEY";


//For mongo db
const MONGO_OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  retryWrites: false,
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || "Admin";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "password";
let MONGO_HOST:string;
if(process.env.NODE_ENV==="test")
{
   MONGO_HOST =`mongodb://localhost/${APP_NAME}-test`
  }
else {
  MONGO_HOST = `mongodb://localhost/${APP_NAME}`;
}
//For server
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const PORT = process.env.NODE_ENV === 'test' ? 3001 :5000;

const config = {
  hostname: SERVER_HOSTNAME,
  port: PORT,
  dbUrl: MONGO_HOST,
  dbOptions: MONGO_OPTIONS,
  dbUsername: MONGO_USERNAME,
  dbPassword: MONGO_PASSWORD,
  SECRET_KEY,
};

export default config;
