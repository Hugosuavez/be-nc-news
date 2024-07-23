const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id, limit = 10, p) => {
  let queryString =
    "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC LIMIT $2";
  const queryValues = [article_id, limit];
  if (p) {
    const page = (p - 1) * limit;
    queryValues.push(page);
    queryString += ` OFFSET $3`;
  }
  return db.query(queryString, queryValues).then((comments) => {
    return comments.rows;
  });
};

exports.createCommentByArticleId = (article_id, username, body) => {
  if (
    !body ||
    !username ||
    typeof username !== "string" ||
    typeof body !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  }

  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "404: Not Found" });
      }
      return rows[0];
    });
};

exports.fetchCommentByCommentId = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "404: Not Found" });
      }
      return rows[0];
    });
};

exports.patchComment = (inc_votes, comment_id) => {
  if (!inc_votes || typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  }

  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "404: Not Found" });
      }
    });
};
