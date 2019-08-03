const mdConverter = new showdown.Converter();
const loaderScreen = document.querySelector('#loader-screen');

const template = ({ title, date, stage, reponame }) => `
<div class="proposal" data-repo_name='${reponame}' data-repo_title='${title}'>
  <h3 class="title">${title}</h3>
  <span class="date">${date}</span>
  <span class="stage">
  <span
    title="Stage ${stage}"
    class="${
      stage === 0
        ? 'gray'
        : stage === 1
        ? 'red'
        : stage === 2
        ? 'orange'
        : stage === 3
        ? 'yellow'
        : 'green'
    }"
  />
  </span>
</div>
`;

function handleCardClick() {
  document.querySelectorAll('.proposal').forEach(e => {
    e.addEventListener('click', async event => {
      const floatWindow = document.querySelector('#float-window-wrapper');
      const floatWindow__content = document.querySelector(
        '#float-window-wrapper .content'
      );

      const readme_content = await fetchGHreadme(
        e.getAttribute('data-repo_name')
      );
      floatWindow__content.innerHTML = mdConverter.makeHtml(
        atob(readme_content)
      );

      floatWindow.classList.add('show');

      // hide loader screen. `setTimeout` because the loader screen
      // should be dismissed once the readme has been loaded
      window.setTimeout(() => (loaderScreen.style.display = 'none'), 600);

      // hide floatWindow
      [...document.querySelectorAll('.close')].forEach(elem => {
        elem.addEventListener('click', e => {
          floatWindow.classList.remove('show');
        });
      });
    });
  });
}

async function fetchGHreadme(repo_name, owner, repo) {
  // show loader screen
  loaderScreen.style.display = 'block';

  let data = await fetch(`/api/readme?reponame=${repo_name}`);
  data = await data.json();

  return data.readme_base64;
}

const proposalContainer__div = document.querySelector('.proprsals');

// Show the loader screen
loaderScreen.style.display = 'block';

fetch('/api/repos.json')
  .then(data => data.json())
  .then(repos => {
    let htmlData = '';

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];

    for (let repo of repos) {
      const date = new Date(repo.created_at);

      htmlData += template({
        title: repo.title,
        date: `${date.getDate()} ${
          months[date.getMonth()]
        }, ${date.getUTCFullYear()}`,
        stage: repo.stage,
        reponame: `${repo.repoName}`,
      });
    }

    proposalContainer__div.innerHTML += htmlData;
    handleCardClick();

    // hide loader screen
    loaderScreen.style.display = 'none';
  });

/**
 * Hide/show Backdrop btns
 */

document
  .querySelector('#side-drawer')
  .addEventListener('click', e => e.stopImmediatePropagation());

const hideBackdropBtn = document.querySelector(
  '#hide-side-drawer-backdrop-btn'
);
hideBackdropBtn.addEventListener('click', () =>
  document
    .querySelector('#side-drawer-backdrop')
    .classList.remove('side-drawer-backdrop-show')
);

const showSideDrawerBtn = document.querySelector('#show-side-drawer');
showSideDrawerBtn.addEventListener('click', () =>
  document
    .querySelector('#side-drawer-backdrop')
    .classList.add('side-drawer-backdrop-show')
);

document
  .querySelector('#side-drawer-backdrop')
  .addEventListener('click', () =>
    document
      .querySelector('#side-drawer-backdrop')
      .classList.remove('side-drawer-backdrop-show')
  );
/**
 * Close warning box
 */

document
  .querySelector('.close-warn-box')
  .addEventListener(
    'click',
    () => (document.querySelector('.warning').style.display = 'none')
  );
