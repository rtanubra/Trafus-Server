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
    getById(db,expense_id){

        return db
            .select('*').from('trafus_expenses').where({'id':expense_id}).first()
    },
    updateById(db,expense_id,updateExpense){
        return db('trafus_expenses').where({'id':expense_id}).update(updateExpense)
    },
    deleteById(db,id){
        return db('trafus_expenses').where({id}).delete()
    }
}

module.exports = ExpensesService


