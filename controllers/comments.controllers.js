const { checkArticleExists } = require('../models/checkArticleExists.model')
const { fetchCommentsByArticleId, createCommentByArticleId } = require('../models/comments.models')
const { checkUserExists } = require('../models/users.models')



exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params

    const promises = [fetchCommentsByArticleId(article_id), checkArticleExists(article_id)]

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