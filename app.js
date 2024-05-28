const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controllers')
const { getEndpoints } = require('./controllers/endpoints.controller')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.all('*', (req, res) => {
    res.status(404).send({msg: "404: Route not found"})
})

module.exports = app