import express from "express";
import { dbConnect } from "./config/dbConnect";
import { APP } from "./config/default";
import routes from "./routes";
import Log from "./utils/Log";

const main = async () => {
  console.log("Hello World");

  const port = APP.port as number;
  const host = APP.host as string;

  const app = express();

  app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);

    try {
      const db = dbConnect;
      db.connect();
      Log.ready("Database is connected");

      routes(app);
    } catch (error) {
      console.log(error);
    }
  });
};

main();
