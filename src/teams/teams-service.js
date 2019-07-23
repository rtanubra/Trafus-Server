const TeamsService = {
    getAllTeams(db){
        return db.select('*').from('trafus_teams').orderBy('id')
    },
    postTeam(db,newTeam){
        return db
            .insert(newTeam)
            .into('trafus_teams').returning("*")
    }
}

module.exports = TeamsService