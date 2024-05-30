const commentsRouter = require('express').Router()
const { deleteComment, getCommentByCommentId } = require('../controllers/comments.controllers')

commentsRouter
.route('/:comment_id')
.delete(deleteComment)
.get(getCommentByCommentId)

module.exports = commentsRouter