const { fetchTopics, fetchArticles, fetchArticle, removeComment } = require("../models/app.models");

const { response, request } = require("../app");
const {
  fetchTopics,
  fetchArticles,
  fetchArticle,
  insertComment,
  updateArticle,
} = require("../models/app.models");
const { response } = require("../app");
const { fetchTopics, fetchArticles, fetchArticle, fetchUsers } = require("../models/app.models");
const { fetchTopics, fetchArticles, fetchArticle, fetchComments } = require("../models/app.models");

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
  const {topic, sort_by, order} = request.query
  fetchArticles(topic, sort_by, order)
  .then((articles) => {
    response.status(200).send({articles})
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticle = (request, response, next) => {
  const articleId = request.params;
  const { article_id } = articleId;
  fetchArticle(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment= (request, response, next)=> {
  const {body, username}= request.body;
  const{article_id}= request.params;
  insertComment(body, username, article_id)
  .then((comment)=> {
    response.status(201).send({ comment})
  })
  .catch((err) => { 
    next(err)
  })
}


exports.patchArticle = (request, response, next) => {
  const { inc_votes } = request.body;
  const { article_id } = request.params;
  updateArticle(inc_votes, article_id)
    .then((article) => {
      response.status(202).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getComments = (request, response, next) => {
  const articleId = request.params
  const {article_id} = articleId
  console.log(article_id)
  fetchComments(article_id)
  .then((comments)=> {
    response.status(200).send({comments})
  })
  .catch((err) => {
    next(err)
  })
}

exports.deleteComment = (request, response, next) => {
  const {comment_id} = request.params
  removeComment(comment_id)
  .then(() => {
    response.status(204).send({})
  })
  .catch((err))
}

exports.getUsers = (request, response, next) => {
  fetchUsers()
  .then((users) => {
    response.status(200).send({ users });
  })
  .catch((err) => {
    next(err);
  });
};

