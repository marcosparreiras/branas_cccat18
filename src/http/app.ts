import express from "express";
import { signup } from "./routes/signup";
import { getAccount } from "./routes/get-account";

export const app = express();
app.use(express.json());

app.post("/signup", signup);
app.get("/account/:accountId", getAccount);
