import { Express } from "express";

export default (app: Express) => {
  app.get("/", (req, res) => {
    req;
    res
      .json({
        message: "cannot GET /",
        status: 404,
        error: "Not Found",
      })
      .status(404);
  });
};
