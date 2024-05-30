const articlesRouter = require('express').Router()
const { getArticleById, getArticles, updateVotes, postArticle } = require('../controllers/articles.controllers')
const { getCommentsByArticleId, postCommentByArticleId } = require('../controllers/comments.controllers')

articlesRouter
.route('/')
.get(getArticles)
.post(postArticle)

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postCommentByArticleId)

articlesRouter
.route('/:article_id')
.get(getArticleById)
.patch(updateVotes)

module.exports = articlesRouter