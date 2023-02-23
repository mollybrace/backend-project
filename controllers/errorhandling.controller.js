
exports.handlePSQL400s = (error, request, response, next) => {
    if (error.code === "22P02") {
        response.status(400).send( {msg: "Invalid Request"})
    } 
    
    if (error.code === "23502") {
        response.status(400).send({msg: "Missing Fields"})
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

    else {
        next(error)
    }
}

exports.handle500s = (error, request, response, next) => {
    response.status(500).send({ msg: "Internal server error"})
    console.log(error)
}