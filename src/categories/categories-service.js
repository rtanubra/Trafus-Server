const xss = require('xss')

const CategoriesSerivce = {
    getAllCategories(db,team_id){
        return db.select('*').from('trafus_categories')
            .where({team_id})
    },
}

module.exports = CategoriesSerivce