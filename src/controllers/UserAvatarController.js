const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class UserAvatarController {
    async update(request, response) {
        const user_id = request.user.id
        const avatarFileName = request.file.filename
        console.log(avatarFileName)

        const diskStorage = new DiskStorage()

        const user = await knex('users').where('id', user_id).first()

        if(!user) {
            throw new AppError('Only authenticated user can update avatar', 401)
        }
        //if there is avatar, delete it
        if(user.avatar) {
            await diskStorage.deleteFile(user.avatar)
        }

        const filename = await diskStorage.saveFile(avatarFileName)

        await knex('users').where('id', user_id).first().update({
            avatar: filename
        })
        user.avatar = filename

        return response.json(user)

    }
}

module.exports = UserAvatarController