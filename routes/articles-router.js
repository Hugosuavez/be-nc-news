const articlesRouter = require('express').Router()
const { getArticleById, getArticles, updateVotes } = require('../controllers/articles.controllers')
const { getCommentsByArticleId, postCommentByArticleId } = require('../controllers/comments.controllers')

articlesRouter
.get('/', getArticles)

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postCommentByArticleId)

articlesRouter
.route('/:article_id')
.get(getArticleById)
.patch(updateVotes)

module.exports = articlesRouter