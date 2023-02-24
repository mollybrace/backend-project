const db = require("../db/connection");
const format = require("pg-format");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = (topic, sort_by = "created_at", order = "DESC") => {
  const validQueries = [
    "title",
    "author",
    "body",
    "created_at",
    "comment_count",
    "topic",
    "votes",
    "article_img_url",
    "article_id",
  ];
  let queryString = `SELECT articles.article_id, articles.author, articles.created_at, articles.title, articles.topic, articles.votes,
    COUNT (comments.article_id) AS comment_count FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id`;

  let queryValues = [];

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryString += `
  GROUP BY articles.article_id 
  ORDER BY ${sort_by} ${order};`;

  console.log(queryString);

  return db.query(queryString, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Topic does not exist" });
    } else {
      console.log(rows.length);
      rows.forEach((row) => {
        row.comment_count = +row.comment_count;
      });
      return rows;
    }
  });
};


exports.fetchArticle = (ArticleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [ArticleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject("Article ID Not Found");
      }
      return rows;
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id= $1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows }) => {
      {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Comment does not exist" });
        }
      }
      return rows;
    });
};
