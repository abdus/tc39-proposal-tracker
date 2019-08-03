const express = require('express');
require('dotenv').config();

const getDataFromRepo = require('./utils/serve-repo-data-to-front-end');
const getReadme = require('./utils/get-readme');

const app = express();

app.use(express.static('static'));
app.listen(3000);

/** GET json data of repositories form database */
app.get('/api/repos.json', async (req, res) => {
  return getDataFromRepo()
    .then(data => res.json(data))
    .catch(error => {
      console.log(error.message);
      return res.json([{}]);
    });
});

/** GET readme of a specific repository */
app.get('/api/readme', (req, res) => {
  getReadme(req.query.reponame)
    .then(data => {
      res.json({
        readme_base64: String.fromCharCode.apply(
          null,
          new Uint16Array(data.readme_md)
        ),
      });
    })
    .catch(error => {
      console.log(error.message);
      res.json({});
    });
});

/** GET: Trigger Repository Database Update */
app.get('/api/update', (req, res) => {
  require('./utils/get-tc39-repo-data');
  res.send('<h1>Update Initiated</h1>');
});
