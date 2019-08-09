const bcrypt = require('bcrypt')

const TeamsService = {
    getAllTeams(db){
        return db.select('*').from('trafus_teams').orderBy('id')
    },
    postTeam(db,newTeam){
        if (newTeam.password){
            const password = bcrypt.hashSync(newTeam.password,12)
            newTeam.password= password
        }
        return db
            .insert(newTeam)
            .into('trafus_teams').returning("*")
    },
    getTeamById(db,id){
        return db.select("*").from('trafus_teams').where({id}).first()
    },
    getTeamByName(db,name){
        return db.select("*").from("trafus_teams").where({name}).first()
    }
}

module.exports = TeamsService