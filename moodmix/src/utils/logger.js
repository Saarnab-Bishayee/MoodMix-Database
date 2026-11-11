const levels = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = levels[process.env.LOG_LEVEL || 'info'] || 1;

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  debug: (...args) => {
    if (currentLevel <= levels.debug) console.log(`[DEBUG] ${timestamp()}`, ...args);
  },
  info: (...args) => {
    if (currentLevel <= levels.info) console.log(`[INFO]  ${timestamp()}`, ...args);
  },
  warn: (...args) => {
    if (currentLevel <= levels.warn) console.warn(`[WARN]  ${timestamp()}`, ...args);
  },
  error: (...args) => {
    if (currentLevel <= levels.error) console.error(`[ERROR] ${timestamp()}`, ...args);
  },
};

module.exports = logger;

