const express = require('express')
const ExpensesService = require('./expenses-service')

const expensesRouter = express.Router()

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

module.exports = expensesRouter