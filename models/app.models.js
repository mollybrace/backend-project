const db = require("../db/connection");
const format = require("pg-format");


exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;")
  .then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = (topic) => {
  topic ??= "articles.article_id";
  console.log(topic)

  let queryString = format (
    `SELECT articles.*, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`, 
  )


  return db
    .query(queryString)
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

exports.removeComment =(comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id= ($1)", [comment_id]
  )
  .then((rows)=> {
    return rows
  })
}
