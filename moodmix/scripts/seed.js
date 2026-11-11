const fs = require('fs');
const path = require('path');
const db = require('../src/config/database');
const logger = require('../src/utils/logger');

async function seed() {
  logger.info('====================================================');
  logger.info('Seeding Standard Genres & Moods...');
  logger.info('====================================================');

  const genresPath = path.join(__dirname, '..', 'database', 'seeds', 'genres.sql');
  const moodsPath = path.join(__dirname, '..', 'database', 'seeds', 'moods.sql');

  const genresSql = fs.readFileSync(genresPath, 'utf8');
  const moodsSql = fs.readFileSync(moodsPath, 'utf8');

  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    await client.query(genresSql);
    await client.query(moodsSql);
    await client.query('COMMIT');

    const gCount = await client.query('SELECT COUNT(*) FROM genres;');
    const mCount = await client.query('SELECT COUNT(*) FROM moods;');

    logger.info(`Seeded ${gCount.rows[0].count} genres and ${mCount.rows[0].count} moods.`);
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await db.pool.end();
  }
}

seed();

