const xss = require('xss')

const CategoriesSerivce = {
    getAllCategories(db,team_id){
        return db.select('*').from('trafus_categories')
            .where({team_id})
    },
    insertCategory(db,newCategory){
        return db
            .insert(newCategory)
            .into('trafus_categories')
            .returning('*')
            .then(([category])=>{return category})
    }
}

module.exports = CategoriesSerivce
