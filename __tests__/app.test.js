const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const app = require("../app");
const { response } = require("../app");
require("jest-sorted")

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return connection.end();
});

describe("GET /api/topics", () => {
  test("200: responds with object of array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        expect(body.topics).toBeInstanceOf(Array);
      });
  });
  test("Each topic contains the correct keys", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with object of array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        expect(body.articles).toBeInstanceOf(Array);
      });
  });
  test("Each article contains the correct keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });

  test("200: Articles should return in date descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body}) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true
        });
      });
      });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Returns with specific article", () => {
    return request(app)
    .get("/api/articles/1")
      .expect(200)
      .then(({ body : {article}}) => {
        expect(article).toHaveLength(1);
        expect(article).toBeInstanceOf(Array);
      article.forEach((key) => {
        expect(key).toHaveProperty("author", expect.any(String));
        expect(key).toHaveProperty("title", expect.any(String));
        expect(key).toHaveProperty("article_id", expect.any(Number));
        expect(key).toHaveProperty("topic", expect.any(String));
        expect(key).toHaveProperty("created_at", expect.any(String));
        expect(key).toHaveProperty("votes", expect.any(Number));
        expect(key).toHaveProperty("article_img_url", expect.any(String));
        expect(key).toHaveProperty("body", expect.any(String));
      })
    })
  })
  test("400: Returns with invalid article request if given an invalid data request (ie: not a number)", () =>{
    return request(app)
    .get("/api/articles/invalid_article_id")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Invalid Request")
    })
  })
   test("404: Returns with article ID not found if given a request of the correct data type that does not exist", () => {
    return request(app)
    .get("/api/articles/3000")
    .expect(404)
    .then((response) =>{
     expect(response.body.msg).toBe("Article ID Not Found")
   })
  })
});

describe.only("GET /api/articles/:article_id/comments", () => {
  test("200: Returns with an array of comments for the given article_id", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body : {comments}}) => {
     expect(comments).toBeInstanceOf(Array);    
    comments.forEach((comment) => {
      expect(comment).toHaveProperty("comment_id", expect.any(Number));
      expect(comment).toHaveProperty("votes", expect.any(Number));
      expect(comment).toHaveProperty("created_at", expect.any(String));
      expect(comment).toHaveProperty("author", expect.any(String));
      expect(comment).toHaveProperty("body", expect.any(String));
      expect(comment).toHaveProperty("article_id", expect.any(Number));
    })
    })
  })
  test("400: Returns with invalid comments request if given an invalid data request (ie: not a number)", () =>{
    return request(app)
    .get("/api/articles/invalid_id/comments")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Invalid Request")
    })
  })
  test("404: Returns with article ID not found if given a request of the correct data type that does not exist", () => {
    return request(app)
    .get("/api/articles/3000")
    .expect(404)
    .then((response) =>{
      expect(response.body.msg).toBe("Article ID Not Found")
    })
 })
});


