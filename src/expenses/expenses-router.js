const express = require('express')
const ExpensesService = require('./expenses-service')

const expensesRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')
const { requireAuth } = require('../middleware/jwt-auth')

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
        for (const [key, value] of Object.entries(newExpense)){
            if (newExpense[key]==null){
                return res.status(400).json({error:`${key} is required to add an expense`})
            }
        }
        ExpensesService.insertExpense(db,newExpense)
            .then(expense=>{
                if(!expense){
                    return res.status(404).json({error:`Category does not exist`}) 
                }
                return res.status(204).json(expense)
            })
    })

expensesRouter
    .route('/expense/:expense_id')
    .all((req,res,next)=>{
        const db= req.app.get('db')
        const id = req.params.expense_id
        ExpensesService.getById(db,id).then(expense=>{
            if (!expense){
                return res.status(404).json({error:`Expense with id ${id} could not be found`})
            }
            else {
                res.expense = expense
                next()
            }
        }).catch(next)
    })
    .get((req,res,next)=>{
        return res.status(200).json(res.expense)
    })
    .patch(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const {name, expense} = req.body
        const updatedBody = {name,expense}
        updatedBody.id = req.params.expense_id
        ExpensesService.updateById(db,updatedBody.id,updatedBody).then(()=>{
            return res.status(204).end()
        })
    })
    .delete((req,res,next)=>{
        const db = req.app.get('db')
        const id = req.params.expense_id
        ExpensesService.deleteById(db,id).then(result=>{
            return res.status(204).end()
        })
    })

module.exports = expensesRouter