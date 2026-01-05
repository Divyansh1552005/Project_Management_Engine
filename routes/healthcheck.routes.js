import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controllers.js";


const healthRouter = Router();

healthRouter.get("/health", healthCheck)


export default healthRouter;

