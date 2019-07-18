const express = require('express')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')
const atob = require('atob')

const ValidateHelper = require('../validator/validator')

usersRouter
    .route('/')
    .post(jsonBodyParser,(req,res,next)=>{
        let {user_name,password} = req.body
        //make sure both are there
        if(!user_name){
            return res.status(400).json({error:"user_name is required"})
        }
        if(!password){
            return res.status(400).json({error:"password is required"})
        }
        user_name= atob(user_name)
        password = atob(password)
        const newUser = {user_name, password}
        
        
        const goodName = ValidateHelper.user_nameCheck(user_name)
        //make sure user_name passes validator 
        if(!goodName[0]){
            return res.status(400).json({error:`user_name ${goodName[1]}`})
        }
        //make sure password passes validator
        const goodPassword = ValidateHelper.passwordCheck(password)
        if(!goodPassword[0]){
            return res.status(400).json({error:`password ${goodPassword[1]}`})
        }
        const db = req.app.get('db')
        UsersService.getByUsername(db,user_name).then(user=>{
            if (user){
                return res.status(400).json({error:`${user_name} is already taken choose another`})
            }
            UsersService.postToDatabaseBasic(db,newUser).then(()=>{
                return res.status(204).end()
            })
        })
        
    })

module.exports = usersRouter