import express, { Application } from "express";
import cors from "cors";
import { postRouter } from "./modules/post/post.routes";
import { auth } from "./libs/auth";
import { toNodeHandler } from "better-auth/node";
import { commentRouter } from "./modules/comments/comment.routes";

const app: Application = express();

app.use(cors({
  origin: process.env.APP_URL,
  credentials: true,
}));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("ArticleX Server is running");
});

export default app;
