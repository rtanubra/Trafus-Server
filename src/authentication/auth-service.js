const jwt = require('jsonwebtoken')
const config = require('../config')
const bcrypt = require('bcrypt')

const AuthService = {
    getUserByUsername(db,user_name){
        return db.select('*').from('trafus_users').where({user_name}).first()
    },
    comparePasswords(pass_plain,pass_hash){
        return bcrypt.compareSync(pass_plain,pass_hash)
    },
    createJwt(subject, payload){
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256'
        })
    },
}

module.exports = AuthService