const app = require('../src/app')
const knex = require('knex')
require('dotenv').config()
const fixture = require('../fixtures/fixtures')

describe('Expenses',()=>{
    let db 
    before('make knex instance',()=>{
        db = knex({
            client:'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db',db)
    })
    before('populate category data-for foreign key purposes',()=>{
        return db.into('trafus_categories').insert(fixture.categories)
    })
    before('truncate table to start clean',()=>{
        return db.raw('truncate trafus_expenses restart identity')
    })

    describe('GET /api/expenses/',()=>{
        
        context('Starting with no data',()=>{
            it('returns [] when no expenses are present',()=>{
                return supertest(app)
                    .get('/api/expenses/')
                    .expect(200)
                    .expect([])
            })
        })

        context('With Starting data',()=>{
            before('add data',()=>{
                return db.into('trafus_expenses').insert(fixture.expenses)
            })
            after('clean data after test',()=>{
                return db.raw('truncate trafus_expenses restart identity')
            })
            it('Returns 200 with expenses populated',()=>{
                return supertest(app)
                    .get('/api/expenses/')
                    .expect(200)
                    .expect(fixture.expenses_answer)
            })
        })
    })

    describe('POST /api/expenses/',()=>{
        before('truncate table to start clean',()=>{
            return db.raw('truncate trafus_expenses restart identity')
        })
        after('truncate table to end',()=>{
            return db.raw('truncate trafus_expenses restart identity')
        })
        context('Correct data provided for a post',()=>{
            it('Returns 204 and expense added into table',()=>{
                return supertest(app)
                    .post('/api/expenses/')
                    .send(fixture.expenses[0])
                    .expect(204)
                    .then(()=>{
                        return supertest(app)
                            .get('/api/expenses/')
                            .expect(200)
                            .expect([fixture.expenses_answer[0]])
                    })
            })
        })
        
        context('Incorrect/ insufficient data provided for a post',()=>{
            const reqs = ['name','expense','category_id']
            reqs.forEach(req=>{
                
                it(`Returns 400 and ${req} is required to add expense`,()=>{
                    const newExpense = {...fixture.expenses[0]}
                    newExpense[req]= null
                    return supertest(app)
                        .post('/api/expenses/')
                        .send(newExpense)
                        .expect(400)
                        .expect({error:`${req} is required to add an expense`})
                })

            })

        })

    })

    after('massive cleaning',()=>{
        return db.raw('truncate trafus_categories restart identity cascade')
    })
    after('disconnect from db',()=>{
        return db.destroy()
    })

})