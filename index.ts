import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import connectDB from "./src/config/db";
import { catchInvalidJsonError } from "./src/middlewares/catchInvalidJsonError";
import createHttpError, { isHttpError } from "http-errors";
import userRoutes from "./src/routes/user";

dotenv.config();
const app = express();

connectDB(process.env.MONGO_URI as string);

app.use(express.json());
app.use(catchInvalidJsonError);

app.use("/api", userRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

app.listen(process.env.PORT, () =>
  console.log("listening on port " + process.env.PORT)
);
