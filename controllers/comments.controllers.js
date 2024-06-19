const { fetchCommentsByArticleId, createCommentByArticleId, removeComment, fetchCommentByCommentId, patchComment, checkCommentExists,  } = require('../models/comments.models')
const { checkArticleExists } = require('../models/checkArticleExists.model')
const { checkUserExists } = require('../models/users.models')



exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {limit, p} = req.query
    
    const promises = [fetchCommentsByArticleId(article_id, limit, p), checkArticleExists(article_id)]

    Promise.all(promises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body 

    const promises = [checkUserExists(username), checkArticleExists(article_id), createCommentByArticleId(article_id, username, body)]
    
    Promise.all(promises).then((resolvedPromises) => {
        const comment = resolvedPromises[2]
        res.status(201).send({comment})
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params

    removeComment(comment_id).then(() => {
        res.status(204).send()
    })
    .catch(next)
}

exports.getCommentByCommentId = (req, res, next) => {
    const {comment_id} = req.params
    fetchCommentByCommentId(comment_id).then((comment) => {
        res.status(200).send({comment})
    })
    .catch(next)
}

exports.updateComment = (req, res, next) => {
    const { inc_votes } = req.body
    const { comment_id } = req.params
    const promises = [checkCommentExists(comment_id), patchComment(inc_votes, comment_id)]

    Promise.all(promises).then((resolvedPromises) => {
        const comment = resolvedPromises[1]
        res.status(200).send({comment})
    })
    .catch(next)
}