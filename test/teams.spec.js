const app = require('../src/app')
const knex = require('knex')
require('dotenv').config()
const fixture = require('../fixtures/fixtures')
const testHelpers = require('../fixtures/testHelpers')

describe('teams',()=>{
    let db 
    before('make knex instance',()=>{
        db = knex({
            client:'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db',db)
    })
    before('Clean before tests',()=>{
            return db.raw('truncate trafus_expenses, trafus_categories, trafus_users, trafus_teams restart identity')
    })
    before('Setup for testing',()=>{
            return db.into('trafus_teams').insert(fixture.teams_builder)
    })
    afterEach('Clean after each endpoint test',()=>{
        return db.raw('truncate trafus_expenses, trafus_categories, trafus_users, trafus_teams restart identity')
    })
    afterEach('Setup after trafus_teams each endpoint test',()=>{
        return db.into('trafus_teams').insert(fixture.teams_builder)
    }) 
    after('Setup after trafus_users each endpoint test',()=>{
        return db.into('trafus_users').insert(fixture.users_builder)
    }) 
    describe('GET /api/teams',()=>{
        context(`Given Teams in trafus_teams`,()=>{
            afterEach('Clean after every test',()=>{
                return db.raw('truncate trafus_expenses, trafus_categories, trafus_users, trafus_teams restart identity')
            })
            afterEach('Setup after each test',()=>{
                return db.into('trafus_teams').insert(fixture.teams_builder)
            })
            it(`Returns 200 and all teams present`,()=>{
                return supertest(app)
                    .get(`/api/teams`)
                    .expect(200,fixture.teams_answer)
            })
        })
    })

    describe(`POST /api/teams`,()=>{
        //for addition of teams, best to start with empty database each time
        beforeEach('Clean before every test',()=>{
            return db.raw('truncate trafus_expenses, trafus_categories, trafus_users, trafus_teams restart identity')
        })
        context(`Sufficient information provided to create a new team`,()=>{
            beforeEach('Clean before every test',()=>{
                return db.raw('truncate trafus_expenses, trafus_categories, trafus_users, trafus_teams restart identity')
            })
            it(`Returns 200 and adds public team (no password) team to trafus_teams`,()=>{
                return supertest(app)
                    .post(`/api/teams/`)
                    .send(fixture.teams[0])
                    .expect(200)
                    .expect(fixture.teams_answer[0])
                    .then(()=>{
                        return supertest(app)
                            .get(`/api/teams/`)
                            .expect(200)
                            .expect([fixture.teams_answer[0]])
                    })
            })
            it(`Returns 200 and adds private (with password) team to trafus_teams`,()=>{
                const expectedTeam = fixture.teams_answer[1]
                expectedTeam.id= 1
                return supertest(app)
                    .post(`/api/teams/`)
                    .send(fixture.teams[1])
                    .expect(200)
                    .expect(res=>{
                        expect(res.body.name).to.eql('team_2')
                        expect(res.body.password).to.not.eql(null)
                        expect(res.body.id).to.eql(1)
                    })
            })
        })
        context(`Insufficient information provided`,()=>{
            it(`Returns a 400 "Name is required" when name not provided`,()=>{
                return supertest(app)
                    .post(`/api/teams/`)
                    .send({bame:"notName"})
                    .expect(400)
                    .expect({error:`Name is required`})
            })
        })
        context(`Does not allow duplicate team names`,()=>{
            it(`Returns a 400 "name already exists" when provided a team name that exists`,()=>{
                return supertest(app)
                    .post(`/api/teams`)
                    .send(fixture.teams_builder[0])
                    .expect(200)
                    .then(()=>{
                        return supertest(app)
                            .post(`/api/teams`)
                            .send(fixture.teams_builder[0])
                            .expect(400)
                            .expect({error:`${fixture.teams_builder[0].name} -team name is currently in use, pick another.`})
                    })
            })
        })
    })

    after('disconnect from db',()=>{
        return db.destroy()
    })
})