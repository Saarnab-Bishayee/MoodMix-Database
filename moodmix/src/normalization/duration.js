function parseIsoDuration(durationStr) {
  if (!durationStr || typeof durationStr !== 'string') return null;

  const regex = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
  const match = durationStr.trim().match(regex);
  if (!match) return null;

  const days = parseInt(match[1] || '0', 10);
  const hours = parseInt(match[2] || '0', 10);
  const minutes = parseInt(match[3] || '0', 10);
  const seconds = parseInt(match[4] || '0', 10);

  return (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
}

module.exports = {
  parseIsoDuration,
};

