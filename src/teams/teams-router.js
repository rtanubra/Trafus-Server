const express = require('express')
const TeamsService = require('./teams-service')

const teamsRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

teamsRouter
    .route('/')
    .get((req,res,next)=>{})