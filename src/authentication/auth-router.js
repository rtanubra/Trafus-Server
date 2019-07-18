const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const atob = require('atob')

authRouter
    .route('/login')
    .post(jsonBodyParser,(req,res,next)=>{
        const {user_name, password} = req.body 
        const user_name_decrypt = atob(user_name)
        const password_decrypt = atob(password)
        if(!user_name || !password){
            return res.status(400).json({error:'Username and Password are required'})
        }
        const db = req.app.get('db')
        AuthService.getUserByUsername(db,user_name_decrypt)
            .then(user=>{
                if(!user){
                    return res.status(400).json({error:'Incorrect Username or password'})
                }
                if(!AuthService.comparePasswords(password_decrypt,user.password)){
                    return res.status(400).json({error:'Incorrect Username or password'})
                }
                else{
                    //return res.status(200).json({message:`Authenticated as ${user_name}`})
                    const subject = user.user_name
                    const payload = {user_id:user.id,team_id:user.team_id}
                    const JsonWebToken=AuthService.createJwt(subject, payload)
                    return res.status(200).json({authToken:JsonWebToken})
                }
            })
    })

module.exports = authRouter