const express = require('express')
const TeamsService = require('./teams-service')

const teamsRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')
const ValidateHelper= require('../validator/validator')

teamsRouter
    .route('/')
    .get((req,res,next)=>{
        const db = req.app.get('db')
        TeamsService.getAllTeams(db).then(teams=>{
            return res.status(200).json(teams)
        })
    })
    .post(jsonBodyParser,(req,res,next)=>{
        const db= req.app.get('db')
        const {name,password} = req.body
        if (!name){
            return res.status(400).json({error:"Name is required"})
        }
        
        const valid = ValidateHelper.nameCheck(name)
        if (!valid[0]){
            return res.status(400).json({error:`Team name ${valid[1]}`})
        }
        const newTeam = {name}
        if (password){
            const validPass = ValidateHelper.passwordCheck(password)
            if (!validPass[0]){
                return res.status(400).json({error:`Password ${validPass[1]}`})
            }
            newTeam.password = password
        }
        TeamsService.getAllTeams(db).then(teams=>{
            const teamsNames = teams.map(team=>{
                return team.name
            })
            if (teamsNames.indexOf(name) > -1){
                return res.status(400).json({error:`${name} -team name is currently in use, pick another.`})
            }
            TeamsService.postTeam(db,newTeam).then((team)=>{
                return res.status(200).json(team[0])
            })
        })
    })

teamsRouter
    .route('/:teamId')
    .get((req,res,next)=>{
        const db = req.app.get('db')
        const {teamId} = req.params
        TeamsService.getTeamById(db,teamId).then((team)=>{
            if(!team){
                return res.status(404).json({error:`${teamId} is not a valid teamId`})
            }
            return res.status(200).json(team)
        })
    })


module.exports = teamsRouter