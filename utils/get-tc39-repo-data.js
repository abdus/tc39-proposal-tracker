const fetch = require('node-fetch');
const { proposals_schema } = require('../models/index');
const getProposalStage = require('./get-proposal-stage');
const remark = require('remark');
const strip = require('strip-markdown');

async function getGHrepoData(queryStr = '', deletePreviousData = true) {
  if (deletePreviousData) {
    // delete all previous data before initiating a new import
    await proposals_schema.collection.deleteMany({});
  }

  const url = 'https://api.github.com/orgs/tc39/repos?per_page=100' + queryStr;

  // start import
  const response = await (await fetch(url)).json();

  if (!response || !Array.isArray(response)) return false;

  let i = 1;
  for (let repo of response) {
    if (repo.name['startsWith']('proposal-')) {
      const makeObj = {};

      makeObj.orgName = repo.owner.login;
      makeObj.repoName = repo.name;
      makeObj.title = normalCase(repo.name['replace']('proposal-', ''));
      makeObj.created_at = repo.created_at;
      makeObj.archived = repo.archived;

      // fetch readme
      let readme = await fetch(
        `https://api.github.com/repos/${repo.owner.login}/${
          repo.name
        }/readme?access_token=${process.env.GH_API_KEY}`
      );
      readme = await readme.json();
      makeObj.readme_md = readme.content;

      if (readme.content) {
        const convertTOmarkdown = await stripMarkDown(
          Buffer.from(readme.content, 'base64').toString()
        );

        const proposalStageArr = convertTOmarkdown.match(
          /\b(\w*[S|s]tage [0-9])|(\w*[S|s]tage: [0-9])\b/g
        );

        makeObj.stage = getProposalStage(proposalStageArr);
      }

      new proposals_schema(makeObj)
        .save()
        .catch(error => console.log(error.message));
    }
  }
}

function normalCase(str = '') {
  return str
    .split('-')
    .map(val => val.charAt(0).toUpperCase() + val.substr(1))
    .join(' ')
    .split('_')
    .map(val => val.charAt(0).toUpperCase() + val.substr(1))
    .join(' ');
}

function normalizeDate(date) {
  return `${new Date(date).getDate()}-${new Date(date).getMonth() +
    1}-${new Date(date).getUTCFullYear()}`;
}

/**
 * FUNCTION: Stript Markdown
 */

function stripMarkDown(md) {
  return new Promise((resolve, reject) => {
    remark()
      .use(strip)
      .process(md, function(err, { contents }) {
        if (err) reject(err);
        resolve(contents);
      });
  });
}

// ///////////////
getGHrepoData()
  .then(() => getGHrepoData('&page=2', false).catch(console.log))
  .catch(console.log);
