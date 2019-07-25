require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const categoriesRouter = require('./categories/categories-router')
const expensesRouter = require('./expenses/expenses-router')
const authRouter = require('./authentication/auth-router')
const userRouter = require('./users/users-router')
const teamsRouter = require('./teams/teams-router')

const app = express()

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())


app.get('/',(req,res)=>{
    res.send("Hello, world!")
})

app.use('/api/categories',categoriesRouter)
app.use('/api/expenses',expensesRouter)
app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)
app.use('/api/teams',teamsRouter)

function errorHandler(error, req,res,next){
    let response
    if (NODE_ENV === 'production'){
        response = {error:{message:"server error"}}
    } else {
        console.log(error)
        response = { message: error.message, error}
    }
    res.status(500).json(response)
}
app.use(errorHandler)



module.exports = app

//log issues