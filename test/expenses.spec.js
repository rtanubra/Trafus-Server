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
            it('Returns 200 and expense added into table',()=>{
                return supertest(app)
                    .post('/api/expenses/')
                    .send(fixture.expenses[0])
                    .expect(200)
                    .then(()=>{
                        return supertest(app)
                            .get('/api/expenses/')
                            .expect(200)
                            .expect([fixture.expenses_answer[fixture.expenses_answer.length-1]])
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

    describe('GET /api/expenses/expense/:expense_id',()=>{
        before('clean data before tests',()=>{
            return db.raw('truncate trafus_expenses restart identity')
        })
        before('fill data to query',()=>{
            return db.into('trafus_expenses').insert(fixture.expenses)
        })
        after('clean data after tests',()=>{
            return db.raw('truncate trafus_expenses restart identity')
        })
        it('returns 200 and the selected expense if exists',()=>{
            const query_select = 1
            return supertest(app)
                .get(`/api/expenses/expense/${query_select}`)
                .expect(200)
                .expect(fixture.expenses_answer[fixture.expenses_answer.length-query_select])
        })
        it('returns 404 and error message expense does not exist',()=>{
            const bad_query = 66
            return supertest(app)
                .get(`/api/expenses/expense/${bad_query}`)
                .expect(404)
                .expect({error:`Expense with id ${bad_query} could not be found`})
        })
    })

    describe('PATCH /api/expenses/expense/:expense_id',()=>{
        before('clean data before tests',()=>{
            return db.raw('truncate trafus_expenses restart identity')
        })
        beforeEach('fill data to query',()=>{
            return db.into('trafus_expenses').insert(fixture.expenses)
        })
        afterEach('clean data after tests',()=>{
            return db.raw('truncate trafus_expenses restart identity')
        })

        const changeObject = {
            name:"some new name",
            expense:36
        }
        const changes = ["name","expense"]
        const query_select =1 
        
        describe('change one thing at a time',()=>{

            it('Returns 204 and correctly changes the name',()=>{
                const newExpense = fixture.expenses_answer[fixture.expenses_answer.length-query_select]
                return supertest(app)
                    .patch(`/api/expenses/expense/${query_select}`)
                    .send({name:changeObject.name})
                    .expect(204)
                    .then(()=>{
                        return supertest(app)
                            .get(`/api/expenses/expense/${query_select}`)
                            .expect(200)
                            .then(res=>{
                                expect(res.body.name).to.eql(changeObject.name)
                                expect(res.body.expense).to.eql(newExpense.expense)
                                expect(res.body.id).to.eql(newExpense.id)
                                expect(res.body.category_id).to.eql(newExpense.category_id)
                            })
                    })
            })
            it('Returns 204 and correctly changes the expense',()=>{
                const newExpense = fixture.expenses_answer[fixture.expenses_answer.length-query_select]
                return supertest(app)
                    .patch(`/api/expenses/expense/${query_select}`)
                    .send({expense:changeObject.expense})
                    .expect(204)
                    .then(()=>{
                        return supertest(app)
                            .get(`/api/expenses/expense/${query_select}`)
                            .expect(200)
                            .then(res=>{
                                expect(res.body.name).to.eql(newExpense.name)
                                expect(res.body.expense).to.eql(changeObject.expense)
                                expect(res.body.id).to.eql(newExpense.id)
                                expect(res.body.category_id).to.eql(newExpense.category_id)
                            })
                    })
            })
            it('returns 404 and error message expense does not exist',()=>{
                const bad_query = 66
                return supertest(app)
                    .get(`/api/expenses/expense/${bad_query}`)
                    .expect(404)
                    .expect({error:`Expense with id ${bad_query} could not be found`})
            })
        })
    })

    describe('DELETE /api/expenses/expense/:expense_id',()=>{
        before('clean data before tests',()=>{
            return db.raw('truncate trafus_expenses restart identity')
        })
        beforeEach('fill data to query',()=>{
            return db.into('trafus_expenses').insert(fixture.expenses)
        })
        afterEach('clean data after tests',()=>{
            return db.raw('truncate trafus_expenses restart identity')
        })
        const bad_query = 900
        const good_query = 1 
        it('Returns 404 and error message stating expense cannot be found',()=>{
            return supertest(app)
                .delete(`/api/expenses/expense/${bad_query}`)
                .expect(404)
                .expect({error:`Expense with id ${bad_query} could not be found`})
        })
        it('Returns 204 and deletes the expense when provided correct id',()=>{
            //validate prior to delete the expense exists
            return supertest(app)
                .get(`/api/expenses/expense/${good_query}`)
                .expect(200)
                .expect(fixture.expenses_answer[fixture.expenses_answer.length-good_query])
                .then(()=>{
                    return supertest(app)
                        .delete(`/api/expenses/expense/${good_query}`)
                        .expect(204)
                        .then(()=>{
                            //delete persists removes expense from list
                            return supertest(app)
                                .get(`/api/expenses/expense/${good_query}`)
                                .expect(404)
                                .expect({error:`Expense with id ${good_query} could not be found`})
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