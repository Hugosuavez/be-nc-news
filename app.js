const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controllers')
const { getEndpoints } = require('./controllers/endpoints.controller')
const { getArticleById, getArticles, updateVotes } = require('./controllers/articles.controllers')
const { getCommentsByArticleId, postCommentByArticleId, deleteComment, getCommentByCommentId } = require('./controllers/comments.controllers')
const { getUsers } = require('./controllers/users.controllers')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', updateVotes)

app.delete('/api/comments/:comment_id', deleteComment)

app.get('/api/comments/:comment_id', getCommentByCommentId)

app.get('/api/users', getUsers)

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