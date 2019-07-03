const express = require('express')
const ExpensesService = require('./expenses-service')

const expensesRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

expensesRouter
    .route('/')
    .get((req,res,next)=>{
        const db = req.app.get('db')
        ExpensesService.getAllExpense(db)
            .then(expenses=>{
                if(!expenses){
                   return res.status(404).json({error:{message:`Category does not exist`}}) 
                }
                return res.status(200).json(expenses)
            })
    })
    .post(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const {name, expense, category_id} = req.body
        const newExpense = {name,expense,category_id}
        ExpensesService.insertExpense(db,newExpense)
            .then(expense=>{
                if(!expense){
                    return res.status(404).json({error:{message:`Category does not exist`}}) 
                }
                return res.status(200).json(expense)
            })
    })

module.exports = expensesRouter