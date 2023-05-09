import express from "express";
import { dbConnect } from "./config/dbConnect";
import { APP } from "./config/default";
import Log from "./utils/Log";
import cors from "cors";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import routes from "./routes";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

import rtmpServer from "./config/liveStreamConfig";

export interface MyContext {
  req?: Request;
}

const main = async () => {
  const port = APP.port as number;
  const host = APP.host as string;

  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  rtmpServer();

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  try {
    const db = dbConnect;
    db.connect();
    Log.ready("Database is connected");

    await server.start();

    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => ({ req: req }),
      })
    );
    Log.ready("apollo server started");

    routes(app);
  } catch (error) {
    console.log(error);
  }

  app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
};

main();
