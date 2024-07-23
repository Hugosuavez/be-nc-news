const {
  fetchArticleById,
  fetchArticles,
  patchVotes,
  createArticle,
  countArticles,
} = require("../models/articles.models");
const { checkArticleExists } = require("../models/checkArticleExists.model");
const { checkUserExists } = require("../models/users.models");
const { checkTopicExists } = require("../models/topics.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;

  const promises = [
    countArticles(topic),
    fetchArticles(topic, sort_by, order, limit, p),
  ];
  if (topic) {
    promises.push(checkTopicExists(topic));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const total_count = resolvedPromises[0];
      const articles = resolvedPromises[1];
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.updateVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  const promises = [
    checkArticleExists(article_id),
    patchVotes(inc_votes, article_id),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const patchedArticle = resolvedPromises[1];
      res.status(200).send({ patchedArticle });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  const promises = [
    checkTopicExists(topic),
    checkUserExists(author),
    createArticle(author, title, body, topic, article_img_url),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const article = resolvedPromises[2].article_id;

      return fetchArticleById(article);
    })
    .then((completeArticle) => {
      res.status(201).send({ completeArticle });
    })
    .catch(next);
};
