const db = require('../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC', [article_id]).then((comments) => {
        return comments.rows
    })
}

exports.createCommentByArticleId = (article_id, username, body) => {
    if(!body || !username || typeof username !== 'string' || typeof body !== 'string'){return Promise.reject({status: 400, msg: '400: Bad Request'})}

    return db.query('INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *', [username, body, article_id]).then(({rows}) => {
        return rows[0]
    })
}