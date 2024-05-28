const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')


afterAll(() => {
    return db.end();
})

beforeEach(() => {
    return seed(data)
})

describe('GET /api/topics', () => {
    test('200: responds with an array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toHaveLength(3)
            body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String)
                })
            })
        })
    })
    test('404: route not found', () => {
        return request(app)
        .get('/api/toopiiiics')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('404: Route not found')
        })
    })
})

describe('GET /api', () => {
    test('200: responds with an object containing descriptions of all other endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const desiredEndpoints = {
                description: expect.any(String),
                queries: expect.any(Array),
                exampleResponse: expect.any(Object),
                requestFormat: expect.any(Object)
            }

            const parsedEndpoints = JSON.parse(body.endpoints)
            
            for(const key in parsedEndpoints){
            expect(desiredEndpoints).toMatchObject(parsedEndpoints[key])
        }
        })
    })
})