const db = require('../db/connection')

exports.fetchArticleById = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id]).then((response) => {
        if(response.rows.length === 0){
            return Promise.reject({status: 404, msg: '404: Not Found'})
        }
        return response.rows[0]
    })
}

exports.fetchArticles = (topic) => {
    if(!topic){return db.query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;').then((articles) => {
        return articles.rows
    })}


    const validTopics = ['mitch', 'cats']
    if(!validTopics.includes(topic)){return Promise.reject({
        status: 400, msg: "400: Bad Request"
    })}

    return db.query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE topic = $1 GROUP BY articles.article_id ORDER BY articles.created_at DESC;', [topic]).then((articles) => {
        return articles.rows
    })
}

exports.patchVotes = (inc_votes, article_id) => {
    if(!inc_votes || typeof inc_votes !== 'number'){
        return Promise.reject({status: 400, msg: '400: Bad Request'})
    }

    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [inc_votes, article_id]).then(({rows}) => {
        return rows[0]
    })
}