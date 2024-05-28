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
            expect(body.msg).toBe('404: Not Found')
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

describe('GET /api/articles/:article_id', () => {
    test('200: responds with articles which match given id parameter', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                article_id: 1,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)

            })
        })
    })
    test.only('404: Not Found', () => {
        return request(app)
        .get('/api/articles/9999999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
    test.only('400: Bad Request', () => {
        return request(app)
        .get('/api/articles/biro')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
})