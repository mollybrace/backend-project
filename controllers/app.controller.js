const { response, request } = require("../app");
const { fetchTopics, fetchArticles, fetchArticle, removeComment } = require("../models/app.models");

exports.getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  const {topic} = request.query
  fetchArticles(topic)
  .then((articles) => {
    response.status(200).send({articles})
  })
  .catch((err) => {
    next(err)
  })
}


exports.getArticle = (request, response, next) =>{
  const articleId = request.params;
  const {article_id} = articleId
  fetchArticle(article_id)
  .then((article) => {
      response.status(200).send({article})
    
  })
  .catch((err) => {
    next(err)
  })
}

exports.deleteComment = (request, response, next) => {
  const {comment_id} = request.params
  removeComment(comment_id)
  .then((comment) => {
    response.status(204).send({msg: "No Content"})
  })
  .catch((console.log("No Content")))
}