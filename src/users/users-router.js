const express = require('express')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')
const atob = require('atob')

const ValidateHelper = require('../validator/validator')

usersRouter
    .route('/')
    .patch(jsonBodyParser,(req,res,next)=>{
        const {id,team_id} = req.body
        const db = req.app.get('db')
        UsersService.updateById(db,id,{team_id}).then((users)=>{
            return res.status(200).json(users[0])
        })
    })
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
            UsersService.postToDatabaseBasic(db,newUser).then((user)=>{
                return res.status(200).json(user)
            })
        })
        
    })
usersRouter
    .route('/:userId')
    .get((req,res,next)=>{
        const db= req.app.get('db')
        const id = req.params.userId
        UsersService.getById(db,id).then(user=>{
            if(!user){
                return res.status(404).json({error:`User with id ${id} does not exist`})
            }
            return res.status(200).json(user)
        })
    })
module.exports = usersRouter