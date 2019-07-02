const express = require('express')
const CategoriesService = require('./categories-service')

const categoriesRouter = express.Router()

categoriesRouter
    .route('/:team_id')
    .get((req,res,next)=>{
        const db  = req.app.get('db')
        const {team_id} = req.params
        CategoriesService.getAllCategories(db,team_id)
            .then(categories=>{
                if(!categories){
                    return res.status(404).json({error:{message:`Category does not exist`}})
                }
                return res.status(200).json(categories)
            })
    })

module.exports = categoriesRouter