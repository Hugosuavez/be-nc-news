const { checkArticleExists } = require('../models/checkArticleExists.model')
const { fetchCommentsByArticleId } = require('../models/comments.models')


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