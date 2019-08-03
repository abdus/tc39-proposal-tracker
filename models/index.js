const mongoose = require('mongoose');
const proposals_schema = require('./proposals.model');

mongoose.connect(
  process.env.DB_STRING,
  { useCreateIndex: true, useNewUrlParser: true },
  err => console.log(err ? err.message : 'Connected to MongoDB!')
);

module.exports = {
  proposals_schema,
};
