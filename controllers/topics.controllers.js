const { fetchTopics, createTopic } = require('../models/topics.models')


exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
}

exports.postTopic = (req, res, next) => {
    const { slug, description } = req.body
    createTopic(slug, description).then((topic) => {
        res.status(201).send({topic})
    })
    .catch(next)
}