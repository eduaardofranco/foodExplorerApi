const AppError = require('../utils/AppError')
const knex = require('../database/knex')
const { hash, compare } = require('bcryptjs')
const { urlencoded } = require('express')

class UsersController {
    async create(request, response) {
        const { name, email, password, role } = request.body

        //validate role
        const validRoles = ['admin', 'user']
        //if there is any, check and set otherwise use default
        const validatedRole = validRoles.includes(role) ? role : 'user'

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
            role: validatedRole
        })

        
        return response.status(201).json(user)
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body
        const user_id = request.user.id
        console.log(user_id)

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
        //define hasedpassword
        let hashedPassword

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

            const hashedPassword = await hash(password, 8)
        }
        console.log(hashedPassword)

        await knex('users')
        .where('id', user_id)
        .update({
            name: name || user.name,
            email: email || user.email,
            password: hashedPassword || user.password,
            updated_at: knex.fn.now()
        })

        
        
        return response.status(200).json(user)
    }

    async delete(request, response) {
        const id = request.params.id
        console.log(id)

        const checkUserExists = await knex('users').where('id', id).first()
        console.log(checkUserExists)

        if(!checkUserExists) {
            throw new AppError('User not found')
        }
        
        try{
            await knex('users').where('id', id).del()
        } catch(error) {
            if(error) {
                throw new AppError(error)
            } else {
                throw new AppError('Faild to delete')
            }
        }
        return response.status(202).json()
    }

}

module.exports = UsersController