const db = require('../db/connection')

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics').then((response) => {
        return response.rows
    })
}

exports.checkTopicExists = (topic) => {
    return db.query('SELECT * FROM topics WHERE slug = $1', [topic]).then(({rows}) => {
        if(!rows.length){return Promise.reject({status: 404, msg: '404: Not Found'})}
    })
}