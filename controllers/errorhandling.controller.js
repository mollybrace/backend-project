
exports.handlePSQL400s = (error, request, response, next) => {
    if (error.code === "22P02") {
        response.status(400).send( {msg: "Invalid Request"})
    } 

    if (error.code === "23502") {
        response.status(400).send({msg: "Missing Fields"})
    }
    if (error.code === "42601"){
        response.status(400).send({msg: "Invalid order query"})
    }
    else  {
        next(error)
    }
}

exports.handleCustomErrors = (error, request, response, next) =>{
    if( error === "Article ID Not Found") {
    response.status(404).send({msg: "Article ID Not Found" })
    } 
    if ( error === "Invalid Request"){
        response.status(404).send({msg: "Path Not Found"})
    }
    if (error === "Topic does not exist"){
        response.status(404).send({msg: "Topic does not exist"})
    }
    if(error=== "Invalid sort_by") {
        response.status(400).send({msg: "Invalid sort by"})
    }
    if (error === "Invalid order query") {
        response.status(400).send({msg: "invalid order"})
    }
    if (error === "comment ID Not Found") {
        response.status(404).send({msg: "Comment ID Not Found"})
    }
    else {
        next(error)
    }
}

exports.handle500s = (error, request, response, next) => {
    console.log(error)
    console.log(request)
    console.log(response)
    response.status(500).send({ msg: "Internal server error"})
}