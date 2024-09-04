import express from "express";
import { signup } from "./signup";

const app = express();
app.use(express.json());

app.post("/signup", signup);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
