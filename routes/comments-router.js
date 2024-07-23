const commentsRouter = require("express").Router();
const {
  deleteComment,
  getCommentByCommentId,
  updateComment,
} = require("../controllers/comments.controllers");

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .get(getCommentByCommentId)
  .patch(updateComment);

module.exports = commentsRouter;
