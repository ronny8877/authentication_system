import mongoose from "mongoose";
import config from "../config";

export default function () {
  mongoose
    .connect(config.dbUrl, config.dbOptions)
    .then(() => {
      console.info(`Connected to database ${config.dbUrl}`);
    })
    .catch((err) => {
      console.error("Error connecting to database", err);
    });
}
