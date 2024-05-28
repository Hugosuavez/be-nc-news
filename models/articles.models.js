const db = require('../db/connection')

exports.fetchArticleById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id]).then((response) => {
        if(response.rows.length === 0){
            return Promise.reject({status: 404, msg: '404: Not Found'})
        }
        return response.rows[0]
    })
}

exports.fetchArticles = () => {
    return db.query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;').then((articles) => {
        return articles.rows
    })
}