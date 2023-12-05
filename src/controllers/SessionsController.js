const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { compare } = require('bcryptjs')
const authConfig = require('../configs/auth')
const { sign } = require('jsonwebtoken')

class SessionsController {
    async create(request, response) {
        const { email, password } = request.body
        
        let emailLowerCase
        //convert email to lowercase
        if(email) {
          emailLowerCase = email.toLowerCase()

        }

        //check user exists by email
        const user = await knex('users').where('email', emailLowerCase).first()

        if(!user) {
            throw new AppError('E-mail or password incorret', 401)
        }

        //compare passwords
        const checkPassword = await compare(password, user.password)

        if(!checkPassword) {
            throw new AppError('E-mail or password incorret', 401)
        }

        const { secret, expiresIn } = authConfig.jwt
        const token = sign(
            {
              sub: String(user.id),
              role: user.role, // Include the role as a claim in the payload
            },
            secret,
            {
              expiresIn,
            }
          );



        return response.json({ user, token })
    }
}

module.exports = SessionsController