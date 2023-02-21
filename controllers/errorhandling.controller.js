
exports.handle400s = (error, request, response, next) => {
    if (error.code === "22P02") {
        response.status(400).send( {msg: "Invalid Request"})
    } else {
        next(error)
    }
}

exports.handleCustomErrors = (error, request, response, next) =>{
    if( error === "Article ID Not Found") {
    response.status(404).send({msg: "Article ID Not Found" })
    }
}


exports.handle500s = (error, request, response, next) => {
    response.status(500).send({ msg: "Internal server error"})
    console.log(error)
}