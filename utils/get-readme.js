const { proposals_schema } = require('../models');

module.exports = reponame => {
  return new Promise((resolve, reject) => {
    proposals_schema
      .findOne({ repoName: reponame })
      .select('-orgName -repoName -created_at, -stage -archived')
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};
