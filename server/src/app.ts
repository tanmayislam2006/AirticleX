import express, { Application } from "express";
import cors from "cors";
import { postRouter } from "./modules/post/post.routers";
import { auth } from "./libs/auth";
import { toNodeHandler } from "better-auth/node";

const app: Application = express();

app.use(cors({
  origin: process.env.APP_URL,
  credentials: true,
}));

app.use(express.json());


app.use("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/posts", postRouter);

app.get("/", (req, res) => {
  res.send("ArticleX Server is running");
});

export default app;
