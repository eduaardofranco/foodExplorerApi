const { verify } = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')

function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization

    if(!authHeader) {
        throw new AppError('Token not informed', 401)
    }
    
    const [,token] = authHeader.split(' ',)
    

    try {
        //check if its a valid token
        const { sub: user_id } = verify(token, authConfig.jwt.secret)

        //put user id in the request
        request.user = {
            id: Number(user_id),
        }

        return next()
    } catch (error) {
        throw new AppError('Invalid Token', 401)
    }

}

module.exports = ensureAuthenticated