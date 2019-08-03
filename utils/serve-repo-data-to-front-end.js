const { proposals_schema } = require('../models');

module.exports = () => {
  return new Promise((resolve, reject) => {
    proposals_schema
      .find()
      .select('-readme_md')
      .sort({ created_at: -1 })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};
