const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    orgName: { type: String, required: true, unique: false },
    repoName: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    created_at: { type: Date, required: true, unique: false },
    stage: { type: Number, required: true, unique: false },
    archived: { type: Boolean, required: false, unique: false },
    readme_md: { type: Buffer, required: false, unique: false },
  },
  { excludeIndexes: 'readme_md' }
);

schema.pre('save', function(next) {
  if (this.isModified()) {
    this.readme_md = Buffer.from(this.readme_md, 'base64');
    next();
  } else next();
});

module.exports = mongoose.model('proposals', schema);
