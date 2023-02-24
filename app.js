const express = require("express");
const {
  getTopics,
  getArticles,
  getArticle,
  deleteComment
} = require("./controllers/app.controller");
const {
  handle500s,
  handle400s,
  handleCustomErrors,
} = require("./controllers/errorhandling.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.use((request, response, next) => {
  response.status(404).send({ msg: "Path Not Found" });
});
app.use(handle400s);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
