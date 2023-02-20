const express = require("express");
const {getTopics} = require("./controllers/app.controller");
const { handle500s } = require("./controllers/errorhandling.controller");

const app = express();
app.use(express.json());

// app.use((request, response, next) => {
//     console.log(request.url);
//     next()
// })

app.get("/api/topics", getTopics);

app.use(handle500s)

module.exports = app;
