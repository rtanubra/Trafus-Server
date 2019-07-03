const express = require('express')
const CategoriesService = require('./categories-service')

const categoriesRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

categoriesRouter
    .route('/:team_id')
    .get((req,res,next)=>{
        const db  = req.app.get('db')
        const {team_id} = req.params
        CategoriesService.getAllCategories(db,team_id)
            .then(categories=>{
                if(!categories){
                    return res.status(404).json({error:`Category does not exist`})
                }
                return res.status(200).json(categories)
            })
    })
    .post(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const {team_id} = req.params

        const {name, budget} = req.body
        const newCategory = {name, budget}

        for (const [key, value] of Object.entries(newCategory))
            if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

        //don't allow this option when you are going from client
        newCategory.team_id= req.body.team_id ? req.body.team_id : team_id

        CategoriesService.insertCategory(db,newCategory)
            .then(category=>{
                return res.status(200).json(category)
            })


    })

module.exports = categoriesRouter