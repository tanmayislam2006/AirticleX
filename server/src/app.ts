import express, { Application } from "express";
import cors from "cors";
import { postRouter } from "./modules/post/post.routers";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use('/api/posts', postRouter);







app.get("/", (req, res) => {
  res.send("ArticleX Server is running");
});
export default app;
