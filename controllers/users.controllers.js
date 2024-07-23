const {
  fetchUsers,
  fetchUserByUsername,
  checkUserExists,
} = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  const promises = [checkUserExists(username), fetchUserByUsername(username)];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const user = resolvedPromises[1];
      res.status(200).send({ user });
    })
    .catch(next);
};
