const IngestionPipeline = require('../src/ingestion/pipeline');
const db = require('../src/config/database');
const logger = require('../src/utils/logger');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (const arg of args) {
    if (arg.startsWith('--limit=')) {
      options.songLimit = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--query=')) {
      options.queryFilter = arg.split('=')[1].replace(/^["']|["']$/g, '');
    } else if (arg.startsWith('--batch=')) {
      options.batchSize = parseInt(arg.split('=')[1], 10);
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();
  const pipeline = new IngestionPipeline(options);

  try {
    await pipeline.run();
  } catch (err) {
    logger.error('Fatal error during ingestion pipeline execution:', err);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

main();

