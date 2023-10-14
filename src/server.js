require('express-async-errors')
const AppError = require('./utils/AppError')
const database = require('./database/sqlite')

const express = require('express')

const routes = require('./routes')

//initialize express
const app = express()
//define type of data coming thruough body, in this case, json
app.use(express.json())

app.use(routes)

database()

app.use(( error, request, response, next) => {
    //capture error from request
    //if error is client side
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        })
    }
    console.error(error)

    //else
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})


const PORT = 3333
//sets the server port
app.listen(PORT, () => console.log(`server running on port: ${PORT}`))