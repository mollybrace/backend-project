const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then(({ rows }) => {
      rows.forEach((row) => {
        row.comment_count = +row.comment_count;
      });
      return rows;
    });
};

exports.fetchArticle = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject("Article ID Not Found");
      }
      return rows;
    });
};

exports.insertComment = (body, username, article_id) => {
  return db
    .query(
      "INSERT INTO comments (body, votes, author, article_id) VALUES ($1, $2,$3, $4) RETURNING *;",
      [body, 0, username, article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateArticle = (inc_votes, article_id) => {
 
    return db
      .query(
        `UPDATE articles SET votes = votes + ($1) WHERE article_id = ($2) RETURNING *;`,
        [inc_votes, article_id]
      )
      .then(({ rows }) => {
        if( rows.length === 0) {
          return Promise.reject("Article ID Not Found")

        }
          return rows[0];

        
      });
  }

/*
if (article.length === 0) {
        response.status(404).send(err)
      }
*/
