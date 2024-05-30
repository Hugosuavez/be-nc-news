const { fetchArticleById, fetchArticles, patchVotes } = require('../models/articles.models')
const { checkArticleExists } = require('../models/checkArticleExists.model')

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const {topic} = req.query
    fetchArticles(topic).then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.updateVotes = (req, res, next) => {
    const {inc_votes} = req.body
    const {article_id} = req.params
    const promises = [checkArticleExists(article_id), patchVotes(inc_votes, article_id)]
    Promise.all(promises).then((resolvedPromises) => {
        const patchedArticle = resolvedPromises[1]
        res.status(200).send({patchedArticle})
    })
    .catch(next)
}