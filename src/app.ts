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

const main = async () => {
  console.log("Hello World");

  const port = APP.port as number;
  const host = APP.host as string;

  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  // A map of functions which return data for the schema.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  try {
    const db = dbConnect;
    db.connect();
    Log.ready("Database is connected");

    await server.start();
    app.use("/graphql", expressMiddleware(server));
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

// const main2 = async () => {
//   // The GraphQL schema

//   const app = express();
//   const httpServer = http.createServer(app);

//   // Set up Apollo Server

//   await new Promise((resolve: any) =>
//     httpServer.listen({ port: 4000 }, resolve)
//   );
//   console.log("🚀 Server ready at http://localhost:4000");
// };

// main2();
