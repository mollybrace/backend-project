const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;")
  .then(({ rows }) => {
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
        row.comment_count = +row.comment_count
      })
      return rows
    })
    }
    
  exports.fetchArticle = (ArticleId) => {
  return db
  .query(
    "SELECT * FROM articles WHERE article_id = $1;", [ArticleId]
  )
  .then(({rows}) => {
    if (rows.length === 0 ) {
      return Promise.reject("Article ID Not Found")
    }  
      return rows
  })
};