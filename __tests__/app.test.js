const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const app = require("../app");
const { response } = require("../app");
require("jest-sorted");

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
      .then(({ body : {topics}}) => {
        expect(topics).toHaveLength(3);
        expect(topics).toBeInstanceOf(Array);
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
      .then(({ body : {articles} }) => {
        expect(articles).toHaveLength(12);
        expect(articles).toBeInstanceOf(Array);
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
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Returns with specific article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
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
        });
      });
  });
  test("400: Returns with invalid article request if given an invalid data request (ie: not a number)", () => {
    return request(app)
      .get("/api/articles/invalid_article_id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });

  });
   
   test("404: Returns with article ID not found if given a request of the correct data type that does not exist", () => {
    return request(app)
    .get("/api/articles/3000")
    .expect(404)
    .then((response) =>{
     expect(response.body.msg).toBe("Article ID Not Found")
   })
  })

describe("GET /api/articles/:article_id/comments", () => {
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

  test("200: Returns with an empty array for an article ID with no comments",() => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body : {comments}}) => {
     expect(comments).toBeInstanceOf(Array);
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
      .then((response) => {
        expect(response.body.msg).toBe("Article ID Not Found");
      });
  });
});

describe("GET /api/articles?topic=", () => {
  test("200:  filters by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(11);
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200: Responds with articles sorted by any valid column (defaults to date)", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("200: Sorts by order ascending when specified and defaults to descending", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });

  test("400: responds with invalid sortby", () => {
    return request(app)
    .get("/api/articles?sort_by=invalid_sortby")
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toBe("Invalid sort by")
    })
  })
  test("404: responds with an error message when given a non existent topic", () => {
    return request(app)
    .get("/api/articles?topic=invalid_topic")
    .expect(404)
    .then(({body: {msg}}) => {
      expect(msg).toBe("Topic does not exist")
  })
});

test("400: responds with invalid order", () => {
  return request(app)
  .get("/api/articles?order=invalid_order")
  .expect(400)
  .then(({body}) => {
    expect(body.msg).toBe("Invalid order query")
  })
})
})


describe("GET: /api/users", () => {
  test("200: Returns with a users containing the correct keys", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });


describe("POST: /api/articles/:article_id/comments", () => {
  test("201:Responds with newly created comment object", () => {
    const newComment = {
      body: "this is the new body",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        comment.forEach((key) => {
          expect(key).toHaveProperty("comment_id", expect.any(Number));
          expect(key).toHaveProperty("body", expect.any(String));
          expect(key).toHaveProperty("article_id", expect.any(Number));
          expect(key).toHaveProperty("author", expect.any(String));
          expect(key).toHaveProperty("votes", expect.any(Number));
          expect(key).toHaveProperty("created_at", expect.any(String));
        });
      });
  });

  test("400: Returns with invalid request if given an invalid data request (ie: not a number)", () => {
    const newComment = {
      body: "this is the new body",
      username: "butter_bridge",
    };
    return request(app)
    .post("/api/articles/invalid_article_id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });

  test("404: Returns with article ID not found if given a request of the correct data type that does not exist", () => {
    const newComment = {
      body: "this is the new body",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/3000")
      .send(newComment)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Path Not Found");
      });
    });
  test("400: respond with bad request if post body contains missing field", () => {
    const newComment = {
      body: "this is the new body",
    };
    return request(app).post("/api/articles/1/comments")
    .send(newComment)
    .expect(400).then(({body}) => {
      expect(body.msg).toBe("Missing Fields")
    })
  })
})


describe("PATCH /api/articles/:article_id", () => {
  test("202: Responds with updated article with votes updated ", () => {
    const newVotesPatch = {
      inc_votes: 50,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotesPatch)
      .expect(202)
      .then(({body: {article}} ) => {       
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      })
    });

    test("404: Returns with article ID not found if given a request of the correct data type that does not exist", () => {
      const newVotesPatch = {
        inc_votes: 50,
      };
      return request(app)
        .patch("/api/articles/3000")
        .send(newVotesPatch)
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Article ID Not Found");
        });
  });
  test("400: Returns with invalid request if given an invalid data request (ie: not a number)", () => {
    const newVotesPatch = {
      inc_votes: 50,
    };
    return request(app)
    .patch("/api/articles/invalid_article_id")
    .send(newVotesPatch)
    .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });    
    })
    
test("400: respond with bad request if post body contains missing field", () => {
  const newVotesPatch = {
  };
  return request(app).patch("/api/articles/1")
  .send(newVotesPatch)
  .expect(400).then(({body}) => {
    expect(body.msg).toBe("Missing Fields")
  })
})
})
})

describe("PATCH /api/comments/:comment_id", () => {
  test("202: Responds with updated comments with votes updated ", () => {
    const newCommentsPatch = {
      inc_votes: 50,
    };
    return request(app)
    .patch("/api/comments/7")
    .send(newCommentsPatch)
    .expect(202)
    .then(({body: {comment}} ) => {  
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("body", expect.any(String));
        expect(comment).toHaveProperty("article_id", expect.any(Number));
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment.votes).toBe(50)
      })
  })
  test("404: Returns with comment ID not found if given a request of the correct data type that does not exist", () => {
    const newCommentsPatch = {
      inc_votes: 50,
    };
    return request(app)
      .patch("/api/comments/3000")
      .send(newCommentsPatch)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Comment ID Not Found");
      });
});
test("400: Returns with invalid request if given an invalid data request (ie: not a number)", () => {
  const newCommentsPatch = {
    inc_votes: 50,
  };
  return request(app)
  .patch("/api/comments/invalid_comment_id")
  .send(newCommentsPatch)
  .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Invalid Request");
    });    
  })
})





// describe("DELETE: /api/comments/:comment_id", () => {
//   test("removes the given comment by comment id",() => {
//     return request(app)
//     .delete("/api/comments/1")
//     .expect(204)
//     .then((response) => {
//       console.log(response)
//       expect(response).toBe("not sure")
//     })
//   })
// })
// // //   // test("404: Responds with an error if the comment_id does not exist", () => {
// // //   //   return request(app)
// // //   //     .delete("/api/comments/3000")
// // //   //     .expect(404)
// //   //     .then(({ body }) => {
// //   //       expect(body.msg).toBe("helloo");
// //   //     });
// //   // });
// // })



