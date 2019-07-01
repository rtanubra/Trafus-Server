const xss = require('xss')

const CategoriesSerivce = {
    getAllCategories(db){
        console.log("here")
        return db.select('*').from('trafus_categories')
    },
}

module.exports = CategoriesSerivce