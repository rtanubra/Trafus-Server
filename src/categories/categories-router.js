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

        newCategory.name = xss(newCategory.name)

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

categoriesRouter
    .route('/category/:category_id')
    .all((req,res,next)=>{
        const db = req.app.get('db')
        const id = req.params.category_id
        CategoriesService.getById(db,id).then(category=>{
            if(!category){
                return res.status(404).json({error:`Could not find Category with id ${id}`})
            }else{
                res.category = category
                next()
            }
        }).catch(next)
    })
    .get((req,res,next)=>{
        return res.status(200).json(res.category)
    })
    .patch(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const {category_id} = req.params
        const {name, budget}= req.body
        const updateCategory = {name,budget}
        if (!name && !budget){
            return res.status(400).json({error:"name or budget is required for an update"})
        }
        CategoriesService.updateById(db,category_id,updateCategory)
            .then(result=>{
                return res.status(204).end()
            })
    })
    .delete((req,res,next)=>{
        const db = req.app.get('db')
        const id = parseInt(req.params.category_id)
        CategoriesService.deleteById(db,id).then((numsRowsEffected)=>{
            res.status(204).end()
        })
    })
module.exports = categoriesRouter