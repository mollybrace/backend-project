
exports.handle500s = (error, request, response, next) => {
    response.status(500).send({ msg: "Internal server error"})
}