import express from "express";
import { signup } from "./routes/signup";

export const app = express();
app.use(express.json());

app.post("/signup", signup);
