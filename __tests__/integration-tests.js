const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const endpointsData = require('../endpoints.json')


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
            expect(body.endpoints).toEqual(endpointsData)
        })
    })
    test('404: route not found', () => {
        return request(app)
        .get('/api/invalid')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('404: Not Found')
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
    test('404: Not Found', () => {
        return request(app)
        .get('/api/articles/9999999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
    test('400: Bad Request', () => {
        return request(app)
        .get('/api/articles/biro')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
})

describe('GET /api/articles', () => {
    test('200: responds with array of article objects', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(13)
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
            })
        })
    })
})

describe('GET /api/articles/:article_id/comments', () => {
    test('200: responds with an array of comments for the given article_id', () => {
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(2)
            expect(body.comments).toBeSortedBy('created_at', {descending: false})
            body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)
                })
            })
        })
    })
    test('400: Bad Request, invalid ID data type', () => {
        return request(app)
        .get('/api/articles/biro/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
       test('404: Not Found, ID not in range', () => {
        return request(app)
        .get('/api/articles/9999999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
    test('200: responds with empty array when article ID exists but there are no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(0)
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('201: responds with newly created comment object', () => {
        return request(app)
        .post('/api/articles/7/comments')
        .send({username: 'rogersop', body: 'A man has got to eat.'})
        .expect(201)
        .then(({body}) => {
            expect(body.comment).toMatchObject({author: 'rogersop', body: 'A man has got to eat.', article_id: 7})
        })
    })
    test('404: Not Found, user does not exist', () => {
        return request(app)
        .post('/api/articles/7/comments')
        .send({username: 'douglas', body: 'A man has got to eat.'})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
    test('404: Not Found, article does not exist', () => {
        return request(app)
        .post('/api/articles/99999/comments')
        .send({username: 'rogersop', body: 'A man has got to eat.'})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
    test('400: Bad Request, invalid ID data type', () => {
        return request(app)
        .post('/api/articles/biro/comments')
        .send({username: 'rogersop', body: 'A man has got to eat.'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
})