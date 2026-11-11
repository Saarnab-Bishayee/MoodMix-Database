const YouTubeAPI = require('../api/youtube');
const { normalizeYouTubeItem } = require('../normalization/track');
const { classifyMoods } = require('../mood/classifier');
const db = require('../db');
const logger = require('../utils/logger');
const { sleep } = require('../utils/rateLimiter');
const { MUSIC_QUERIES } = require('../config/queries');

class IngestionPipeline {
  constructor(options = {}) {
    this.youtube = new YouTubeAPI(options.apiKey);
    this.songLimit = options.songLimit || Number(process.env.SONG_LIMIT) || 1000;
    this.batchSize = options.batchSize || Number(process.env.BATCH_SIZE) || 50;
    this.requestDelay = Number(process.env.REQUEST_DELAY_MS) || 150;
    this.queryFilter = options.queryFilter || '';
  }

  async run() {
    logger.info('====================================================');
    logger.info('Starting MoodMix Normalized Music Ingestion Pipeline');
    logger.info(`Target Song Limit: ${this.songLimit}`);
    logger.info('====================================================');

    let queries = [...MUSIC_QUERIES];
    if (this.queryFilter) {
      const filterTerms = this.queryFilter.toLowerCase().split(/\s+/).filter(Boolean);
      queries = queries.filter((q) => {
        const text = `${q.query} ${q.genre} ${q.language}`.toLowerCase();
        return filterTerms.some((term) => text.includes(term));
      });
      logger.info(`Filtered down to ${queries.length} matching queries.`);
    }

    const stats = {
      totalSearched: 0,
      uniqueSongsInserted: 0,
      songsUpdated: 0,
      artistsCreated: 0,
      albumsCreated: 0,
      genresLinked: 0,
      moodsLinked: 0,
      errors: 0,
    };

    const seenVideoIds = new Set();
    const client = await db.getClient();

    try {
      // Ensure genre and mood caches are warm
      await db.loadGenresAndMoods(client);

      for (let qIndex = 0; qIndex < queries.length; qIndex++) {
        if (stats.uniqueSongsInserted >= this.songLimit) {
          logger.info(`Reached target song limit (${this.songLimit}). Stopping ingestion.`);
          break;
        }

        const queryConfig = queries[qIndex];
        logger.info(`[${qIndex + 1}/${queries.length}] Processing Query: "${queryConfig.query}"`);

        let pageToken = null;
        let queryFetched = 0;
        // Limit per query to allow diverse genres across all queries
        const maxPerQuery = Math.max(25, Math.ceil(this.songLimit / queries.length));

        while (queryFetched < maxPerQuery && stats.uniqueSongsInserted < this.songLimit) {
          try {
            // 1. Search YouTube page
            const searchResult = await this.youtube.searchVideos({
              query: queryConfig.query,
              maxResults: Math.min(this.batchSize, maxPerQuery - queryFetched),
              pageToken,
            });

            if (!searchResult.videoIds || searchResult.videoIds.length === 0) {
              logger.debug(`No further videos for query: "${queryConfig.query}"`);
              break;
            }

            // Filter out video IDs already processed in this run
            const newVideoIds = searchResult.videoIds.filter((id) => !seenVideoIds.has(id));
            searchResult.videoIds.forEach((id) => seenVideoIds.add(id));

            if (newVideoIds.length === 0) {
              logger.debug('All video IDs in this page were already processed.');
              if (!searchResult.nextPageToken) break;
              pageToken = searchResult.nextPageToken;
              continue;
            }

            // 2. Fetch detailed video metadata
            const rawDetails = await this.youtube.getVideoDetails(newVideoIds);
            stats.totalSearched += rawDetails.length;

            // 3. Process each video in a transaction
            for (const item of rawDetails) {
              const track = normalizeYouTubeItem(item, queryConfig);
              if (!track) continue;

              await client.query('BEGIN');
              try {
                // A. Primary & Featured Artists
                const artistIds = [];
                for (const art of track.artists) {
                  const aId = await db.findOrCreateArtist(client, {
                    name: art.name,
                    youtubeChannelId: art.position === 1 ? track.channelId : null,
                  });
                  artistIds.push({ id: aId, role: art.role, position: art.position });
                }

                const primaryArtistId = artistIds.length > 0 ? artistIds[0].id : null;

                // B. Album
                const albumId = await db.findOrCreateAlbum(
                  client,
                  {
                    title: track.albumTitle,
                    releaseDate: track.releaseDate,
                    coverImageUrl: track.thumbnailUrl,
                    albumType: 'single',
                  },
                  primaryArtistId
                );
                track.albumId = albumId;

                // C. Prepare attributes matching the specification schema
                const derivedMoods = classifyMoods(track);
                track.moodTags = derivedMoods.map((m) => m.slug);
                track.artist = track.artists?.map((a) => a.name).join(', ') || null;
                track.album = track.albumTitle || null;
                track.genre = queryConfig.genre || (track.genres && track.genres[0]) || null;
                track.metadata = {
                  viewCount: track.rawMetadata?.viewCount || null,
                  likeCount: track.rawMetadata?.likeCount || null,
                  channelTitle: track.channelTitle || null,
                  query: queryConfig.query || null,
                };

                // D. Upsert Song (populates all core catalog columns)
                const songRow = await db.upsertSong(client, track);
                const songId = songRow.song_id;

                if (songRow.is_inserted) {
                  stats.uniqueSongsInserted++;
                } else {
                  stats.songsUpdated++;
                }

                // E. Link Song-Artists (Many-to-Many)
                for (const art of artistIds) {
                  await db.linkSongArtist(client, songId, art.id, art.role, art.position);
                }

                // F. Link Song-Genres (Many-to-Many)
                if (queryConfig.genre) {
                  const genreId = await db.findOrCreateGenre(client, queryConfig.genre);
                  await db.linkSongGenre(client, songId, genreId, true);
                  stats.genresLinked++;
                }

                // G. Link Song-Moods (Many-to-Many)
                for (const m of derivedMoods) {
                  const moodId = await db.getMoodIdBySlug(client, m.slug);
                  if (moodId) {
                    await db.linkSongMood(client, songId, moodId, m.confidence, m.source);
                    stats.moodsLinked++;
                  }
                }

                // H. Song Attributes (Audio / recommendation attributes)
                const initialAttributes = {
                  energy: track.energy === 'high' ? 0.85 : track.energy === 'low' ? 0.25 : 0.55,
                  tempo: null, // Explicitly NULL: quality over fake data
                };
                await db.upsertSongAttributes(client, songId, initialAttributes);

                await client.query('COMMIT');
                queryFetched++;
              } catch (trackErr) {
                await client.query('ROLLBACK');
                logger.error(`Error saving track "${track.title}" (${track.youtubeVideoId}):`, trackErr.message);
                stats.errors++;
              }
            }

            logger.info(
              `  Progress: ${stats.uniqueSongsInserted} songs inserted (+${queryFetched} this query) | ${stats.songsUpdated} updated`
            );

            // Pagination advance
            pageToken = searchResult.nextPageToken;
            if (!pageToken) {
              logger.debug(`Reached last page of YouTube results for "${queryConfig.query}"`);
              break;
            }

            await sleep(this.requestDelay);
          } catch (pageErr) {
            logger.error(`Error processing page for "${queryConfig.query}":`, pageErr.message);
            stats.errors++;
            break;
          }
        }
      }
    } finally {
      client.release();
    }

    logger.info('====================================================');
    logger.info('MoodMix Database Ingestion Complete!');
    logger.info(`Total Videos Searched:       ${stats.totalSearched}`);
    logger.info(`Unique Songs Inserted:       ${stats.uniqueSongsInserted}`);
    logger.info(`Existing Songs Updated:      ${stats.songsUpdated}`);
    logger.info(`Total Genre Links Created:   ${stats.genresLinked}`);
    logger.info(`Total Mood Links Created:    ${stats.moodsLinked}`);
    logger.info(`Errors / Failed Records:     ${stats.errors}`);
    logger.info('====================================================');

    return stats;
  }
}

module.exports = IngestionPipeline;
