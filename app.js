const express = require("express");
const {
  getTopics,
  getArticles,
  getArticle,
  deleteComment,
  getUsers,
  postComment,
  patchArticle,
  getComments,
  patchComment,
} = require("./controllers/app.controller");
const {
  handle500s,
  handlePSQL400s,
  handleCustomErrors,
} = require("./controllers/errorhandling.controller");
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle)

app.get("/api/articles/:article_id/comments", getComments);

app.patch("/api/comments/:comment_id", patchComment);

app.use((request, response, next) => {
  response.status(404).send({ msg: "Path Not Found" })
});

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
