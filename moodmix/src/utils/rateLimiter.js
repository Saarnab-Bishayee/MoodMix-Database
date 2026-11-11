const logger = require('./logger');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryWithBackoff(fn, retries = 3, initialDelayMs = 500) {
  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= retries) {
        throw err;
      }
      logger.warn(`API call failed (${err.message}). Retrying in ${delay}ms (attempt ${attempt}/${retries})...`);
      await sleep(delay);
      delay *= 2; // Exponential backoff
    }
  }
}

module.exports = {
  sleep,
  retryWithBackoff,
};

