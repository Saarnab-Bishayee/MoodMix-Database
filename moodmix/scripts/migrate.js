const fs = require('fs');
const path = require('path');
const db = require('../src/config/database');
const logger = require('../src/utils/logger');

async function migrate() {
  logger.info('====================================================');
  logger.info('Running MoodMix Database Migrations...');
  logger.info('====================================================');

  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const client = await db.getClient();
  try {
    await client.query(sql);
    logger.info('Successfully applied database schema (10 normalized tables & indexes).');
  } catch (err) {
    logger.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await db.pool.end();
  }
}

migrate();

