const xss = require('xss')

const ExpensesService = {
    getAllExpense(db){
        return db.select('*').from('trafus_expenses')
    },
    insertExpense(db, newExpense){
        return db
            .insert(newExpense)
            .into('trafus_expenses')
            .returning('*')
            .then(([expense])=> {return expense})
    },
}

module.exports = ExpensesService


