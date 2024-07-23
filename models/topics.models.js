const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((response) => {
    return response.rows;
  });
};

exports.checkTopicExists = (topic) => {
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [topic])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "404: Not Found" });
      }
    });
};

exports.createTopic = (slug, description) => {
  if (
    !slug ||
    !description ||
    typeof slug !== "string" ||
    typeof description !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "400: Bad Request" });
  }

  return db
    .query(
      "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *",
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
