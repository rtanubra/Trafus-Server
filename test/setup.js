process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'

const { expect } = require('chai')
const supertest = require('supertest')
require('dotenv').config()

global.expect = expect
global.supertest = supertest