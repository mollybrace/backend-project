const request = require("supertest");
const seed= require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const app = require("../app");

beforeEach(() => {
    return seed(data)
});

afterAll(() => {
    return connection.end()
});

describe.only("GET /api/topics", () => {
  test("200: responds with object of array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body.topics).toHaveLength(3);
        expect(body.topics).toBeInstanceOf(Array);
      });
  });
  test("Each topic contains the correct keys", () =>{
    return request(app)
    .get("/api/topics")
      .expect(200)
      .then(({body :{topics}}) => {
        topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String))
            expect(topic).toHaveProperty("description", expect.any(String))
        })
      })
  })
});
