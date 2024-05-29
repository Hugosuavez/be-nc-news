const db = require('../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC', [article_id]).then((comments) => {
        // if(comments.rows.length === 0){
        //     return Promise.reject({status: 404, msg: '404: Not Found'})
        // }
        return comments.rows
    })
}