const xss = require('xss')

const CategoriesSerivce = {
    getAllCategories(db,team_id){
        return db.select('*').from('trafus_categories').orderBy('id','desc')
    },
    insertCategory(db,newCategory){
        return db
            .insert(newCategory)
            .into('trafus_categories')
            .returning('*')
            .then((category)=>{return category[0]})
    },
    getById(db,category_id){
        return db.select('*').from('trafus_categories').where({'id':category_id}).first()
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
