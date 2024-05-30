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
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)

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
                    comment_count: expect.any(Number)
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
                    article_id: 3
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
            expect(body.comment).toMatchObject({comment_id: 19, author: 'rogersop', body: 'A man has got to eat.', article_id: 7, votes: 0, created_at: expect.any(String)})
        })
    })
    test('201: responds with newly created comment object and ignores unnecessary properties on request object', () => {
        return request(app)
        .post('/api/articles/7/comments')
        .send({username: 'rogersop', body: 'A man has got to eat.', test: 9})
        .expect(201)
        .then(({body}) => {
            expect(body.comment).toMatchObject({comment_id: 19, author: 'rogersop', body: 'A man has got to eat.', article_id: 7, votes: 0, created_at: expect.any(String)})
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
    test('400: Bad Request, invalid request body', () => {
        return request(app)
        .post('/api/articles/7/comments')
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
    test('400: Bad Request, invalid request body', () => {
        return request(app)
        .post('/api/articles/7/comments')
        .send({username: 1, body: 4})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
    
})

describe('PATCH /api/articles/:article_id', () => {
    test('200: responds with the updated article when votes are increased', () => {
        return request(app)
        .patch('/api/articles/3')
        .send({inc_votes: 1})
        .expect(200)
        .then(({body}) => {
            expect(body.patchedArticle).toEqual({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 1,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
        })
    })
    test('200: responds with the updated article when votes are decreased', () => {
        return request(app)
        .patch('/api/articles/3')
        .send({inc_votes: -30})
        .expect(200)
        .then(({body}) => {
            expect(body.patchedArticle).toEqual({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: -30,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
        })
    })
    test('400: Bad Request, invalid request body', () => {
        return request(app)
        .patch('/api/articles/3')
        .send({article_id: -30})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
    test('400: Bad Request, invalid request body', () => {
        return request(app)
        .patch('/api/articles/3')
        .send({inc_votes: 'string'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
    test('404: Not Found, article does not exist', () => {
        return request(app)
        .patch('/api/articles/99999')
        .send({inc_votes: 3})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
    test('400: Bad Request, invalid ID data type', () => {
        return request(app)
        .patch('/api/articles/string')
        .send({inc_votes: 3})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
})


describe('DELETE /api/comments/:comment_id', () => {

    test('204: responds with no content', () => {
        return request(app)
        .get('/api/comments/13')
        .expect(200)
        .then(({body}) => {
            expect(body.comment).toMatchObject({
                comment_id: 13,
                body: 'Fruit pastilles',
                article_id: 1,
                author: 'icellusedkars',
                created_at: "2020-06-15T10:25:00.000Z",
                votes: 0
              })
              
              return request(app)
              .delete('/api/comments/13')
              .expect(204)
        })  
        .then(({body}) => {
            expect(body).toEqual({})

          return request(app)
          .get('/api/comments/13')
          .expect(404)
        })
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })

    test('404: Not Found, article does not exist', () => {
        return request(app)
        .delete('/api/comments/99999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })

    test('400: Bad Request, invalid ID data type', () => {
        return request(app)
        .delete('/api/comments/string')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
})

describe('GET /api/comments/:comment_id', () => {
    test('200: responds with no comment', () => {
        return request(app)
        .get('/api/comments/13')
        .expect(200)
        .then(({body}) => {
          expect(body.comment).toMatchObject({
            comment_id: 13,
            body: 'Fruit pastilles',
            article_id: 1,
            author: 'icellusedkars',
            created_at: "2020-06-15T10:25:00.000Z",
            votes: 0
          })  
        })
    })
    test('404: Not Found, article does not exist', () => {
        return request(app)
        .get('/api/comments/99999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
    test('400: Bad Request, invalid ID data type', () => {
        return request(app)
        .get('/api/comments/string')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
})

describe('GET /api/users', () => {
    test('200: responds with an array of user objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.users).toHaveLength(4)
            body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})

describe('GET /api/articles (topic query)', () => {
    test('200: responds with an array of all articles that are about specified topic', () => {
    return request(app)
    .get('/api/articles?topic=mitch')
    .expect(200)
    .then(({body}) => {
        expect(body.articles).toHaveLength(12)
        body.articles.forEach((article) => {
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: 'mitch',
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
            })
        })
    })
})
    test('400: invalid topic', () => {
        return request(app)
        .get('/api/articles?topic=cars')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("400: Bad Request")
        })
    })
})

describe('GET /api/articles (sorting queries)', () => {
    test('200: responds with array of article objects sorted by given column', () => {
        return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(13)
            expect(body.articles).toBeSortedBy('title', {descending: true})
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    })
    test('200: responds with array of article objects sorted by given column and order', () => {
        return request(app)
        .get('/api/articles?sort_by=author&order=ASC')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(13)
            expect(body.articles).toBeSortedBy('author', {descending: false})
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    })
    test('400: Bad Request, invalid query value', () => {
        return request(app)
        .get('/api/articles?sort_by=authr&order=ASC')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("400: Bad Request")
        })
    })
    test('400: Bad Request, invalid query value', () => {
        return request(app)
        .get('/api/articles?sort_by=author&order=BSC')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("400: Bad Request")
        })
    })
})

describe('GET /api/users/:username', () => {
    test('200: responds with the user that matches with the username on the request', () => {
        return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({body}) => {
            expect(body.user).toEqual({ 
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url:
                  'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            })
        })
    })
    test('404: Not Found, user does not exist', () => {
        return request(app)
        .get('/api/users/douglas')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
})

describe('PATCH /api/comments/:comment_id', () => {
    test('200: responds with the updated comment when votes are increased', () => {
        return request(app)
        .patch('/api/comments/5')
        .send({inc_votes: 5})
        .expect(200)
        .then(({body}) => {
            expect(body.comment).toEqual({
                comment_id: 5,
                body: 'I hate streaming noses',
                article_id: 1,
                author: 'icellusedkars',
                votes: 5,
                created_at: "2020-11-03T21:00:00.000Z"
            })
        })
    })
    test('200: responds with the updated comment when votes are decreased', () => {
        return request(app)
        .patch('/api/comments/5')
        .send({inc_votes: -5})
        .expect(200)
        .then(({body}) => {
            expect(body.comment).toEqual({
                comment_id: 5,
                body: 'I hate streaming noses',
                article_id: 1,
                author: 'icellusedkars',
                votes: -5,
                created_at: "2020-11-03T21:00:00.000Z"
            })
        })
    })
    test('400: Bad Request, invalid request body', () => {
        return request(app)
        .patch('/api/comments/5')
        .send({article_id: -30})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
    test('400: Bad Request, invalid request body', () => {
        return request(app)
        .patch('/api/comments/3')
        .send({inc_votes: 'string'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
    test('404: Not Found, comment does not exist', () => {
        return request(app)
        .patch('/api/comments/99999')
        .send({inc_votes: 3})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: Not Found")
        })
    })
    test('400: Bad Request, invalid comment ID data type', () => {
        return request(app)
        .patch('/api/comments/string')
        .send({inc_votes: 3})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400: Bad Request')
        })
    })
})

