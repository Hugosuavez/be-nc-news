const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controllers')
const { getEndpoints } = require('./controllers/endpoints.controller')
const { getArticleById, getArticles } = require('./controllers/articles.controllers')
const { getCommentsByArticleId } = require('./controllers/comments.controllers')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.use((err, req, res, next) => {
    if(err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    else next(err)
})

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: '400: Bad Request'})
    }
    else next(err)
})

app.all('*', (req, res) => {
    res.status(404).send({msg: "404: Not Found"})
})

module.exports = app