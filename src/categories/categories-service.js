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
    },
    getById(db,category_id){
        return db.select('*').from('trafus_categories').where({'id':category_id})
    },
    updateById(db,category_id,updateCategory){
        return db('trafus_categories').where({ 'id':category_id }).update(updateCategory)
    },
    deleteById(db,id){
        console.log("here")
        return db('trafus_categories').where({id}).delete()
    }
}

module.exports = CategoriesSerivce
