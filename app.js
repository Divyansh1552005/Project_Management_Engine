import express from "express";
import cors from "cors";
import healthRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// global middlewares
app.use(
  express.json({
    limit: "16kb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);
// to serve static files
app.use(express.static("public"));

// cors config
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

// COOKIE PARSER
app.use(cookieParser());


// import the routes
app.get("/", (req, res) => {
  res.send("Started PM Engine Project!!!");
});



app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", userRouter)



export default app;
