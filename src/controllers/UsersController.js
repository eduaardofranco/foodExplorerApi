const AppError = require('../utils/AppError')
const knex = require('../database/knex')
const { hash, compare } = require('bcryptjs')
const { urlencoded } = require('express')

class UsersController {
    async create(request, response) {
        const { name, email, password, role } = request.body

        //if role is different from required
        if(role !== 'admin' && role !== 'user') {
            throw new AppError('Role must be Admin or User')
        }

        const checkUserExists = await knex('users').where({ email }).first()

        if(checkUserExists) {
            throw new AppError('E-mail already registered!')
        }
        //hash password
        const hashedPassword = await hash(password, 8)

        //insert users data
        const [user] = await knex('users')
        .returning('*')
        .insert({
            name,
            email,
            password: hashedPassword,
            role
        })

        
        response.status(201).json(user)
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body
        const user_id = request.params.id

        const user = await knex('users').where('id', user_id).first()

        const emailAlreadyExists = await knex('users').where({ email }).first()

        if(emailAlreadyExists) {
            throw new AppError('This e-mail already registered')
        }

        //check if there is new data and are not empty
        if (name !== null && name !== '') {
            user.name = name;
        } else {
            throw new AppError('Name can not be empty')
        }
        if (email !== null && email !== '') {
            user.email = email;
        } else {
            throw new AppError('E-mail can not be empty')
        }

        if(password && !old_password) {
            throw new AppError('You need to inform your last password')
        }
        if(password && old_password) {

            //compare old password
            const checkOldPassword = await compare(old_password, user.password)

            //if doesnt match
            if(!checkOldPassword) {
                throw new AppError('Last password incorrect')
            }

            user.password = await hash(password, 8)
        }

        await knex('users').update(user)

        
        
        response.status(200).json(user)
    }

    delete() {

    }

}

module.exports = UsersController