require('express-async-errors')
require('dotenv/config')
const AppError = require('./utils/AppError')
const database = require('./database/sqlite')
const uploadConfig = require('./configs/upload')
const cors = require('cors')

const express = require('express')

const routes = require('./routes')

//initialize express
const app = express()
//define application to use cors to handle the requests from front end
app.use(cors())
//define type of data coming thruough body, in this case, json
app.use(express.json())

app.use(routes)

//press. static serves static files
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

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


const PORT = process.env.PORT || 3333
//sets the server port
app.listen(PORT, () => console.log(`server running on port: ${PORT}`))