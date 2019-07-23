const xss = require('xss')
const bcrypt = require('bcrypt')

const UsersService = {
    getByUsername(db,user_name){
        return db.select('*')
            .from('trafus_users').where({user_name}).first()
    },
    postToDatabaseBasic(db,user){
        const user_name = user.user_name
        const password = bcrypt.hashSync(user.password,12)
        const name = 'basic_name'
        const team_id = 1
        return db.insert({user_name,password,name,team_id}).into('trafus_users').returning("*")
    },
    updateById(db,id,update){
        return db('trafus_users').where({id}).update(update).returning("*")
    },
    getById(db,id){
        return db.select('*').from('trafus_users').where({id}).first()
    }
}

module.exports = UsersService