const db = require('../config/database');
const repositories = require('./repositories');

module.exports = {
  ...db,
  ...repositories,
};

