const xss = require('xss')

const ExpensesService = {
    getAllExpense(db){
        return db.select('*').from('trafus_expenses')
    },
}

module.exports = ExpensesService