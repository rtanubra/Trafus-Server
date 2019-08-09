const app = require('../src/app')
const knex = require('knex')
require('dotenv').config()
const fixture = require('../fixtures/fixtures')


describe('categories' ,()=>{
    let db 
    before('make knex instance',()=>{
        db = knex({
            client:'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db',db)
    })

    before('truncate table to start clean',()=>{
        return db.raw('truncate trafus_categories restart identity cascade')
    })

    describe('GET /api/categories/1 ',()=>{
        context('No starting data',()=>{
            it('returns 200 with no categories',()=>{
                return supertest(app)
                        .get('/api/categories/1/')
                        .expect(200,[])
            })
        })

        context('Starting data provided',()=>{
            before('clean data',()=>{
                return db.raw('truncate trafus_categories restart identity cascade')
            })
            before('place data',()=>{
                return db.into('trafus_categories').insert(fixture.categories)
            })
            after('clean data',()=>{
                return db.raw('truncate trafus_categories restart identity cascade')
            })
            it('returns 200 and all categoties',()=>{
                return supertest(app)
                    .get('/api/categories/1')
                    .expect(200).expect((res)=>{
                        expect(res.body).to.eql(fixture.categories_answer)
                    })
            })

        })
    })

    describe('POST /api/categories/1 ',()=>{
        before('clean data',()=>{
            return db.raw('truncate trafus_categories restart identity cascade')
        })
        it('Returns 200 when posting GOOD new category also test it PERSISTS',()=>{
            const category = fixture.categories[0]
            return supertest(app)
                .post('/api/categories/1')
                .send(category)
                .expect(200)
                .expect(fixture.categories_answer[2]).then(postRes=>{
                    return supertest(app)
                        .get('/api/categories/1')
                        .expect(200)
                        .expect([fixture.categories_answer[2]])
                })
        })
        context('Returns 400 when posting INCOMPLETE category data should not persist',()=>{
            it(`It returns 400 and {error: "Missing 'name' in request body"}`,()=>{
                return supertest(app)
                    .post('/api/categories/1')
                    .send({budget:20})
                    .expect(400)
                    .expect({error: "Missing 'name' in request body"})
            })
            it(`It returns 400 and {error: "Missing 'budget' in request body"}`,()=>{
                return supertest(app)
                    .post('/api/categories/1')
                    .send({name:"Incomplete category"})
                    .expect(400)
                    .expect({error: "Missing 'budget' in request body"})
            })
        })
        after('clean data after test',()=>{
            return db.raw('truncate trafus_categories restart identity cascade')
        })
    })
   
    describe('GET api/categories/category/:category_id ',()=>{
        before('clean data',()=>{
            return db.raw('truncate trafus_categories restart identity cascade')
        })
        before('place data',()=>{
            return db.into('trafus_categories').insert(fixture.categories)
        })
        it('returns 200 and object when provided correct id',()=>{
            return supertest(app)
                .get('/api/categories/category/1')
                .expect(200)
                .expect(fixture.categories_answer[2])
        })
        it('returns 404 object not found when provided incorrect id',()=>{
            return supertest(app)
                .get('/api/categories/category/58923')
                .expect(404)
                .expect({error:`Could not find Category with id 58923`})
        })
        after('clean data',()=>{
            return db.raw('truncate trafus_categories restart identity cascade')
        })
    })

    describe('PATCH /api/categories/category/:category_id',()=>{
        before('clean data',()=>{
            return db.raw('truncate trafus_categories restart identity cascade')
        })
        beforeEach('seed data',()=>{
            return db.into('trafus_categories').insert(fixture.categories)
        })
        afterEach('clean data after each (because seeding required)',()=>{
            return db.raw('truncate trafus_categories restart identity cascade')
        })
        const newName = "some new name"
        const target = 1
        const newBudget = 36000
        it('returns 204 and changes name of budget',()=>{
            return supertest(app)
                .patch(`/api/categories/category/${target}/`)
                .send({name:newName})
                .expect(204).then(()=>{
                    return supertest(app)
                        .get(`/api/categories/category/${target}/`)
                        .expect(200)
                        .then(res=>{
                            expect(res.body.name).to.eql(newName)
                            expect(res.body.budget).to.eql(fixture.categories_answer[target+1].budget)
                            expect(res.body.id).to.eql(fixture.categories_answer[target+1].id)
                            expect(res.body.team_id).to.eql(fixture.categories_answer[target+1].team_id)
                        })
                })
        })

        it('returns 204 and changes the budget',()=>{
            return supertest(app)
                .patch(`/api/categories/category/${target}/`)
                .send({budget:newBudget})
                .expect(204)
                .then(res=>{
                    return supertest(app)
                        .get(`/api/categories/category/${target}/`)
                        .expect(200)
                        .then(res=>{
                            expect(res.body.name).to.eql(fixture.categories_answer[target+1].name)
                            expect(res.body.budget).to.eql(newBudget)
                            expect(res.body.id).to.eql(fixture.categories_answer[target+1].id)
                            expect(res.body.team_id).to.eql(fixture.categories_answer[target+1].team_id)
                        })
                })
        })
        
    })
    
    describe('DELETE /api/categories/category/:category_id',()=>{
        before('clean data',()=>{
            return db.raw('truncate trafus_categories restart identity cascade')
        })
        context('no starting data',()=>{
            it('returns 404 object not found when provided incorrect id',()=>{
                return supertest(app)
                    .delete('/api/categories/category/1')
                    .expect(404)
                    .expect({error:`Could not find Category with id 1`})
            })
        })
        
        context('with starting data',()=>{
            before('add data',()=>{
                return db.into('trafus_categories').insert(fixture.categories[0])
            })
            it('Returns 204 and deletes object',()=>{
                //object added
                return supertest(app)
                    .get('/api/categories/category/1')
                    .expect(200)
                    .expect(fixture.categories_answer[2])
                    .then(res=>{
                        return supertest(app)
                            .delete('/api/categories/category/1')
                            .expect(204)
                            .then(()=>{
                                return supertest(app)
                                    .get('/api/categories/category/1')
                                    .expect(404)
                                    .expect({error:`Could not find Category with id 1`})
                            })
                    })
            })
        })
        after('clean data',()=>{
            return db.raw('truncate trafus_categories restart identity cascade')
        })
    })
   
    after('disconnect from db',()=>{
        return db.destroy()
    })

})

