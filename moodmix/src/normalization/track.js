const { parseIsoDuration } = require('./duration');

const NOISE_PATTERNS = [
  /\(Official\s*(?:Music)?\s*Video\)/gi,
  /\[Official\s*(?:Music)?\s*Video\]/gi,
  /\(Official\s*Audio\)/gi,
  /\[Official\s*Audio\]/gi,
  /\(Lyric\s*(?:Video)?\)/gi,
  /\[Lyric\s*(?:Video)?\]/gi,
  /\(Visualizer\)/gi,
  /\[Visualizer\]/gi,
  /\(Full\s*(?:Video|Song)\)/gi,
  /\[Full\s*(?:Video|Song)\]/gi,
  /\(4K\s*(?:Video)?\)/gi,
  /\[4K\s*(?:Video)?\]/gi,
  /\(Audio\)/gi,
  /\[Audio\]/gi,
];

function cleanTitle(rawTitle) {
  if (!rawTitle) return '';
  let cleaned = rawTitle.trim();
  for (const pattern of NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
}

function parseArtistsAndTitle(rawTitle, channelTitle) {
  const cleaned = cleanTitle(rawTitle);

  let title = cleaned;
  let artistString = channelTitle || '';

  // Check for "Artist - Title" format
  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ');
    artistString = parts[0].trim();
    title = parts.slice(1).join(' - ').trim();
  } else if (cleaned.includes(' | ')) {
    const parts = cleaned.split(' | ');
    title = parts[0].trim();
    if (!artistString && parts[1]) artistString = parts[1].trim();
  }

  // Split multiple artists (e.g., "Arijit Singh, Shilpa Rao & Anirudh" or "Dua Lipa feat. DaBaby")
  const artists = [];
  if (artistString) {
    // Replace feat., ft., featuring, &, with comma
    const normalizedArtists = artistString
      .replace(/\s+(?:feat\.|ft\.|featuring)\s+/gi, ', ')
      .replace(/\s+&\s+/g, ', ')
      .replace(/\s+x\s+/gi, ', ');

    const rawList = normalizedArtists.split(',').map((a) => a.trim()).filter(Boolean);

    rawList.forEach((name, index) => {
      // Clean leading/trailing punctuation
      const cleanName = name.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').trim();
      if (cleanName && cleanName.length > 1) {
        artists.push({
          name: cleanName.slice(0, 255),
          role: index === 0 ? 'primary' : 'featured',
          position: index + 1,
        });
      }
    });
  }

  if (artists.length === 0 && channelTitle) {
    artists.push({
      name: channelTitle.trim().slice(0, 255),
      role: 'primary',
      position: 1,
    });
  }

  return {
    title: (title || cleaned).slice(0, 255),
    artists,
  };
}

function calculatePopularity(viewCount, likeCount) {
  if (!viewCount) return 0;
  // Logarithmic popularity scale 0-100 based on YouTube views
  // 1,000 views = ~20, 100k views = ~45, 10M views = ~75, 1B views = ~95+
  const views = Number(viewCount) || 0;
  if (views <= 0) return 0;
  const score = Math.round(Math.min(100, Math.log10(views) * 10 + 5));
  return Math.max(0, score);
}

function normalizeYouTubeItem(item, queryContext = {}) {
  const videoId = item.id;
  if (!videoId) return null;

  const snippet = item.snippet || {};
  const contentDetails = item.contentDetails || {};
  const statistics = item.statistics || {};

  const { title, artists } = parseArtistsAndTitle(snippet.title, snippet.channelTitle);
  const durationSeconds = parseIsoDuration(contentDetails.duration);

  // Skip livestreams or missing duration
  if (!durationSeconds || durationSeconds <= 0) return null;

  // Pick best available thumbnail
  const thumbnails = snippet.thumbnails || {};
  const thumbnailUrl =
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    null;

  const releaseDate = snippet.publishedAt ? snippet.publishedAt.slice(0, 10) : null;
  const popularity = calculatePopularity(statistics.viewCount, statistics.likeCount);

  return {
    title,
    durationSeconds,
    releaseDate,
    language: queryContext.language || null,
    explicit: false,
    popularity,
    youtubeVideoId: videoId,
    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl,
    artists,
    albumTitle: queryContext.album || `${title} - Single`,
    genres: queryContext.genres || (queryContext.genre ? [queryContext.genre] : []),
    moods: queryContext.moods || [],
    energy: queryContext.energy || null,
    channelId: snippet.channelId,
    channelTitle: snippet.channelTitle,
    rawMetadata: {
      channelTitle: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      viewCount: statistics.viewCount ? Number(statistics.viewCount) : null,
      likeCount: statistics.likeCount ? Number(statistics.likeCount) : null,
      isoDuration: contentDetails.duration,
      query: queryContext.query,
    },
  };
}

module.exports = {
  cleanTitle,
  parseArtistsAndTitle,
  normalizeYouTubeItem,
  calculatePopularity,
};

