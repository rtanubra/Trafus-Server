const express = require('express')
const ExpensesService = require('./expenses-service')
const UsersService = require('../users/users-service')

const expensesRouter = express.Router()
const jsonBodyParser = express.json()
const xss = require('xss')

expensesRouter
    .route('/')
    .get((req,res,next)=>{
        const db = req.app.get('db')
        ExpensesService.getAllExpense(db)
            .then(expenses=>{
                return res.status(200).json(expenses)
            })
    })
    .post(jsonBodyParser,(req,res,next)=>{
        const db = req.app.get('db')
        const {name, expense, category_id,creator_id,date_created} = req.body
        const newExpense = {name,expense,category_id}
        for (const [key, value] of Object.entries(newExpense)){
            if (newExpense[key]==null){
                return res.status(400).json({error:`${key} is required to add an expense`})
            }
        }
        if (!date_created){
            newExpense.date_created = new Date()
        }
        else {
            //requires validation
            newExpense.date_created= date_created
        }
        if (!creator_id){
            newExpense.creator_id=1
        }else{
            newExpense.creator_id=creator_id
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
    .route('/expense/:expenseId')
    .all((req,res,next)=>{
        const db= req.app.get('db')
        const id = req.params.expenseId
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
        updatedBody.id = req.params.expenseId
        ExpensesService.updateById(db,updatedBody.id,updatedBody).then(()=>{
            return res.status(204).end()
        })
    })
    .delete((req,res,next)=>{
        const db = req.app.get('db')
        const id = req.params.expenseId
        ExpensesService.deleteById(db,id).then(result=>{
            return res.status(204).end()
        })
    })

module.exports = expensesRouter