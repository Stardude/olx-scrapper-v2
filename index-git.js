(async () => {
    const simpleGit = require('simple-git/promise');
    const git = simpleGit();

    await git.pull();
})();