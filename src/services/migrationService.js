const { getDao, getMigrations } = require('../dao');
const schemaVersionDao = getDao('schemaVersionDao');

const logger = require('../utils/logger')('MIGRATION');

module.exports.migrateDatabase = async () => {
    const migrations = getMigrations();
    const versions = await schemaVersionDao.getAll();

    for (let i = 0; i < migrations.length; i++) {
        const migration = migrations[i];
        const version = versions.find(version => version.name === migration.name);

        if (!version) {
            try {
                await migration.action();
                await schemaVersionDao.create({
                    name: migration.name
                });
            } catch (err) {
                logger.error(`An error occurred during migrating ${migration.name}: ${err}`);
                throw err;
            }
        }
    }
};