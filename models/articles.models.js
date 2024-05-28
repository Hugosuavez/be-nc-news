const db = require('../db/connection')

exports.fetchArticleById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id]).then((response) => {
        if(response.rows.length === 0){
            return Promise.reject({status: 404, msg: '404: Not Found'})
        }
        return response.rows[0]
    })
}