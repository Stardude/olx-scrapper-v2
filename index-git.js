(async () => {
    try {
        const gitConfig = require('./config/git');
        const simpleGit = require('simple-git/promise');
        const remote = `https://${gitConfig.username}:${gitConfig.password}@${gitConfig.repo}`;
        const git = simpleGit();

        await git.init();

        await git.removeRemote('origin');
        await git.addRemote('origin', remote);

        await git.addConfig('user.email', gitConfig.email);
        await git.addConfig('user.name', gitConfig.username);

        const updated = await git.pull('origin', 'master');
        console.log(updated);
        console.log('\n\n');
    } catch (e) {
        console.error(e);
    }
})();