const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controllers')

app.get('/api/topics', getTopics)

app.all('*', (req, res) => {
    res.status(404).send({msg: "404: Route not found"})
})

module.exports = app