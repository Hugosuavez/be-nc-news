const db = require('../db/connection')

exports.fetchArticleById = (article_id) => {
    
    return db.query('SELECT articles.*, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;', [article_id]).then((response) => {
        if(response.rows.length === 0){
            return Promise.reject({status: 404, msg: '404: Not Found'})
        }
        return response.rows[0]
    })
}

exports.countArticles = (topic) => {
    
    let queryString = 'SELECT * FROM articles'
    let queryValues = []
    if(topic){
        queryValues.push(topic)
        queryString += ' WHERE topic = $1'}

    return db.query(queryString, queryValues).then(({rows}) => {
        
        return rows.length
    })
}

exports.fetchArticles = (topic, sort_by = 'created_at', order = 'DESC', limit = 10, p) => {

    const validSortColumns = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count']

    const validOrder = ['ASC', 'DESC']


    if(!validOrder.includes(order)){return Promise.reject({
        status: 400, msg: "400: Bad Request"
    })}

    if(!validSortColumns.includes(sort_by)){return Promise.reject({
        status: 400, msg: "400: Bad Request"
    })}
    
    let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`

    let queryValues = []

    if(topic){
        queryString += ` WHERE topic = $1`
        queryValues.push(topic)
    }

    queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`
    queryValues.push(Number(limit))
    
    queryString += ` LIMIT $${queryValues.length}`

    if(p){
        const page = (p-1)*limit
        queryValues.push(page)
        queryString += ` OFFSET $${queryValues.length}`
    }
    
    return db.query(queryString, queryValues).then((articles) => {
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

exports.createArticle = (author, title, body, topic, article_img_url = 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700') => {
    if(!author || !title || !body || !topic || typeof author !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof topic !== 'string'){return Promise.reject({status: 400, msg: '400: Bad Request'})}
    
    return db.query('INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [author, title, body, topic, article_img_url]).then(({rows}) => {
        return rows[0]
    })
}