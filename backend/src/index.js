import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import { morganMiddleware } from "./middlewares/logger.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [ process.env.ORIGIN, process.env.ORIGIN2, ];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(morganMiddleware());

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening`);
    });
  })
  .catch((err) => {
    console.error(`error connecting db and server`);
  });

// routes
import heathCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import chatDetailsRouter from "./routes/chatDetails.routes.js";
import roleRouter from "./routes/role.routes.js"; 
import reviewRouter from "./routes/review.routes.js";
import incidentTypeRouter from "./routes/incidentType.routes.js";
import incidentReportingRouter from "./routes/incidentReporting.routes.js";

app.use("/api/v1/incidentTypes", incidentTypeRouter);
app.use("/api/v1/incidentReportings", incidentReportingRouter);
app.use("/api/v1/reviews", reviewRouter); 
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/chatDetails", chatDetailsRouter);
app.use("/api/v1", heathCheckRouter);
app.use("/api/v1/users", userRouter);
app.use(errorMiddleware);
