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
        const {name} = req.body
        if (!name){
            return res.status(400).json({error:"Name is required"})
        }
        const valid = ValidateHelper.nameCheck(name)
        if (!valid[0]){
            return res.status(400).json({error:`Team name ${valid[1]}`})
        }
        
        const newTeam = {name}
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


module.exports = teamsRouter