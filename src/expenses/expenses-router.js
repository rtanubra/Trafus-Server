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

expensesRouter
    .route('/expense/:expense_id')
    .get((req,res,next)=>{
        const db= req.app.get('db')
        const {expense_id}= req.params
        ExpensesService.getById(db,expense_id).then(expenses=>{
            return res.status(200).json(expenses[0])
        })
    })
    .patch(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const {name, expense} = req.body
        const updatedBody = {name,expense}
        updatedBody.id = req.params.expense_id
        console.log(updatedBody)
        ExpensesService.updateById(db,updatedBody.id,updatedBody).then(()=>{
            return res.status(204).end()
        })
    })
    .delete((req,res,next)=>{
        const db = req.app.get('db')
        const id = req.params.expense_id
        ExpensesService.deleteById(db,id).then(result=>{
            console.log(result)
            return res.status(204).end()
        })
    })

module.exports = expensesRouter